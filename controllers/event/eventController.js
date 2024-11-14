// ========== Models ==========
const Event = require("../../models/event");
const Member = require("../../models/member");
const EmailService = require("../../models/emailService");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const S3Client = require("../../awsConfig");
const express = require("express");
const EventEmitter = require("events");
const pdfkit = require("pdfkit");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp"); // Import sharp for image processing

// Create an instance of EventEmitter for SSE
const qrScanEmitter = new EventEmitter();

// ========== Controller ==========
class EventController {
  // Event function handler to get all events
  static getAllEvent = async (req, res) => {
    try {
      const events = await Event.getAllEvent();
      res.json(events);
    } catch (error) {
      console.error("Error retrieving events:", error.message);
      res.status(500).send("Error retrieving events");
    }
  };

  // Event function handler to get events by ID
  static getEventById = async (req, res) => {
    const eventID = req.params.eventId; // Use console.log here to debug
    console.log("Received eventID:", eventID);

    try {
      const events = await Event.getEventById(eventID);
      if (events.length > 0) {
        res.json(events);
      } else {
        res.status(404).json({ message: "No events found" });
      }
    } catch (error) {
      console.error("Error retrieving events by ID:", error);
      res.status(500).send("Error retrieving events");
    }
  };

  // Event function handler to get events by member ID
  static getEventByMemberId = async (req, res) => {
    const memberID = req.params.memberId; // Use console.log here to debug
    console.log("Received memberID:", memberID);

    try {
      const events = await Event.getEventByMemberId(memberID);

      if (events.length > 0) {
        // Include logic to check or manipulate the experience attribute if necessary
        const eventsWithExperience = events.map((event) => ({
          ...event,
          experience: event.experience || null, // Fallback or default value
        }));

        res.json(eventsWithExperience);
      } else {
        res.status(404).json({ message: "No events found for this member" });
      }
    } catch (error) {
      console.error("Error retrieving events by member ID:", error);
      res.status(500).send("Error retrieving events");
    }
  };

  // Event function handler to get unique event types with pictures
  static getUniqueEventTypes = async (req, res) => {
    try {
      const uniqueEventTypes = await Event.getUniqueEventTypes(); // Fetch event types and pictures
      res.json(uniqueEventTypes);
    } catch (error) {
      console.error("Error retrieving unique event types:", error.message);
      res.status(500).send("Error retrieving unique event types");
    }
  };

  static updateEvent = async (req, res) => {
    const eventId = req.params.eventId; // Get the eventID from the request parameters
    const updatedData = req.body; // Get the updated data from the request body

    try {
      // Call the update function in the Event model
      const result = await Event.updateEvent(eventId, updatedData);
      res.status(200).send("Event updated successfully");
    } catch (error) {
      console.error("Error updating event:", error.message); // Log the error message
      res.status(500).send("Failed to save changes"); // Send a user-friendly error message
    }
  };

  // Event function handler to delete an event by ID
  static deleteEventById = async (req, res) => {
    const eventID = req.params.eventId;

    try {
      await Event.deleteEventById(eventID);
      res.status(200).json({
        message: `Event with ID ${eventID} has been deleted successfully.`,
      });
    } catch (error) {
      console.error("Error deleting event:", error.message);
      res.status(500).send(`Failed to delete event with ID ${eventID}.`);
    }
  };

  // Event function handler to create an event
  static createEvent = async (req, res) => {
    const newEventData = req.body; // Get the new event data from the request body

    try {
      // Call the create function in the Event model
      const newEventId = await Event.createEvent(newEventData);
      res
        .status(201)
        .json({ message: "Event created successfully", eventId: newEventId });
    } catch (error) {
      console.error("Error creating event:", error.message); // Log the error message
      res.status(500).send("Failed to create event"); // Send a user-friendly error message
    }
  };

  // Event function handler to enroll a member to an event using POST parameters
  static enrollMemberToEvent = async (req, res) => {
    // Use req.body to extract data from POST request
    const {
      memberID,
      eventID,
      fullName,
      age,
      schoolName,
      interests,
      medicalConditions,
      lunchOption,
      specifyOther,
    } = req.body;

    console.log("[DEBUG] Received enrollment data:", {
      memberID,
      eventID,
      fullName,
      age,
      schoolName,
      interests,
      medicalConditions,
      lunchOption,
      specifyOther,
    });

    try {
      const response = await Event.enrollMemberToEvent(
        memberID,
        eventID,
        fullName,
        age,
        schoolName,
        interests,
        medicalConditions,
        lunchOption,
        specifyOther
      );

      // If enrollment is successful, respond with success, memberEventID, and newMembership status
      console.log("[DEBUG] Enrollment response from model:", response);

      res.status(200).json({
        success: response.success,
        message: response.message,
        memberEventID: response.memberEventID,
        newMembership: response.newMembership, // Include newMembership in the response
      });
    } catch (error) {
      console.error("Error enrolling member to event:", error);
      res.status(500).json({
        success: false,
        message: "Error enrolling member to event",
        error: error.message, // Include error message for better debugging
      });
    }
  };

  // SSE endpoint to notify when QR code is scanned
  static qrScanSSE = (req, res) => {
    const { memberID, eventID } = req.query;
    console.log(
      "[DEBUG] SSE connection requested with memberID:",
      memberID,
      "and eventID:",
      eventID
    );

    // Check if memberID or eventID is missing in the query
    if (!memberID || !eventID) {
      console.error(
        "[DEBUG] SSE request missing memberID or eventID. Cannot establish connection."
      );
      res.status(400).json({
        error: "memberID and eventID are required in the query parameters.",
      });
      return;
    }

    console.log(
      "[DEBUG] SSE connection established for memberID:",
      memberID,
      "and eventID:",
      eventID
    );

    // Set headers for SSE
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Listener for the 'qrScan' event
    const sendQRScanUpdate = (data) => {
      console.log(
        "[DEBUG] QR scan event received in SSE listener. Data:",
        data
      );

      // Debugging type and value of memberID and eventID
      console.log(
        `[DEBUG] Comparing data.memberID: ${
          data.memberID
        } (type: ${typeof data.memberID}) with memberID: ${memberID} (type: ${typeof memberID})`
      );
      console.log(
        `[DEBUG] Comparing data.eventID: ${
          data.eventID
        } (type: ${typeof data.eventID}) with eventID: ${eventID} (type: ${typeof eventID})`
      );

      // Convert both `data.memberID` and `data.eventID` to strings for consistent comparison
      const receivedMemberID = String(data.memberID);
      const receivedEventID = String(data.eventID);
      const queryMemberID = String(memberID);
      const queryEventID = String(eventID);

      // Debugging the converted values
      console.log(
        `[DEBUG] After conversion - receivedMemberID: ${receivedMemberID}, queryMemberID: ${queryMemberID}`
      );
      console.log(
        `[DEBUG] After conversion - receivedEventID: ${receivedEventID}, queryEventID: ${queryEventID}`
      );

      if (
        receivedMemberID === queryMemberID &&
        receivedEventID === queryEventID
      ) {
        console.log(
          "[DEBUG] Match found for memberID and eventID. Sending SSE..."
        );
        res.write(`event: qrScan\n`);
        res.write(`data: ${JSON.stringify(data)}\n\n`);
      } else {
        console.log("[DEBUG] No match for SSE conditions. Ignoring event.");
      }
    };

    // Listen for QR scan event
    qrScanEmitter.on("qrScan", sendQRScanUpdate);

    // Remove listener when the connection is closed
    req.on("close", () => {
      console.log(
        "[DEBUG] SSE connection closed for memberID:",
        memberID,
        "and eventID:",
        eventID
      );
      qrScanEmitter.removeListener("qrScan", sendQRScanUpdate);
    });
  };

  // Endpoint to trigger the QR scan event without memberEventID
  static triggerQRScan = (req, res) => {
    const { memberID, eventID } = req.query; // Extract memberID and eventID from query parameters

    if (!memberID || !eventID) {
      console.error("[DEBUG] Missing memberID or eventID in triggerQRScan.");
      return res
        .status(400)
        .json({ error: "memberID and eventID are required." });
    }

    console.log(
      "[DEBUG] Triggering QR scan event with memberID:",
      memberID,
      "(type:",
      typeof memberID,
      "), eventID:",
      eventID,
      "(type:",
      typeof eventID
    );

    // Emit the qrScan event with only memberID and eventID
    qrScanEmitter.emit("qrScan", {
      success: true,
      memberID,
      eventID,
    });

    console.log(
      "[DEBUG] QR scan event emitted successfully for memberID:",
      memberID,
      "and eventID:",
      eventID
    );

    res.status(200).json({ message: "QR scan event triggered successfully." });
  };

  // Add this method inside the EventController class
  static getEventByEventId = async (req, res) => {
    const eventID = req.params.eventId; // Retrieve eventID from URL parameter

    try {
      const event = await Event.getEventByEventId(eventID);

      if (event) {
        res.json(event); // Return the event details if found
      } else {
        res.status(404).json({ message: "Event not found" }); // Return 404 if not found
      }
    } catch (error) {
      console.error("Error retrieving event by event ID:", error.message);
      res.status(500).send("Error retrieving event");
    }
  };

  static async generateInvoicePDF(
    eventDetails,
    participantsData,
    memberDetails, // Accept memberDetails from the request body
    memberEventID
  ) {
    console.log("[DEBUG] Generating PDF invoice...");

    try {
      if (!memberDetails) {
        throw new Error("Member details not provided in the request.");
      }

      // Use Promise.all to handle PDF generation
      const pdfBuffer = await new Promise((resolve, reject) => {
        const doc = new pdfkit();
        const bufferChunks = [];

        doc.on("data", (chunk) => bufferChunks.push(chunk));
        doc.on("end", () => {
          const buffer = Buffer.concat(bufferChunks);
          resolve(buffer); // Resolve with the buffer when PDF generation is done
        });

        // Handle PDF generation errors
        doc.on("error", (error) => {
          console.error("[DEBUG] Error during PDF generation:", error);
          reject(error);
        });

        // Proceed with PDF content creation using memberDetails
        const quantity = participantsData.length;

        // Add Mindsphere Logo
        const logoUrl = "public/img/logo/mindsphere-logo.png";
        const logoImageSize = 80; // Set logo image size
        doc.image(logoUrl, 50, 40, {
          fit: [logoImageSize, logoImageSize],
          align: "left",
        });

        // Invoice Header
        doc
          .fontSize(26)
          .font("Helvetica-Bold")
          .text("INVOICE", 400, 50, { align: "right" });
        doc
          .fontSize(12)
          .font("Helvetica")
          .text(`Invoice No.: ${memberEventID}`, 400, 80, { align: "right" });
        doc.moveDown(2);

        // Date of Invoice
        const currentDate = new Date().toLocaleDateString();
        doc
          .fontSize(12)
          .text(`Date: ${currentDate}`, 50, 110, { align: "left" });
        doc.moveDown(1);

        // Billed To (Member Details)
        doc
          .fontSize(12)
          .font("Helvetica-Bold")
          .text("Billed to:", 50, 150, { align: "left" });
        doc
          .fontSize(12)
          .font("Helvetica")
          .text(
            `${memberDetails.firstName} ${memberDetails.lastName}`,
            50,
            165,
            { align: "left" }
          );
        doc.text(`${memberDetails.email}`, 50, 180, { align: "left" });
        doc.text("123 Anywhere St., Any City", 50, 195, { align: "left" });
        doc.text("Phone: 123-456-7890", 50, 210, { align: "left" }); // Placeholder for phone
        doc.text("Fax: 098-765-4321", 50, 225, { align: "left" }); // Placeholder for fax

        // From Mindsphere
        const fromYPosition = 150;
        doc
          .fontSize(12)
          .font("Helvetica-Bold")
          .text("From:", 350, fromYPosition, { align: "left" });
        doc
          .fontSize(12)
          .font("Helvetica")
          .text("Mindsphere", 350, fromYPosition + 15, { align: "left" });
        doc.text("60 Paya Lebar Road,", 350, fromYPosition + 30, {
          align: "left",
        });
        doc.text("Singapore 409501", 350, fromYPosition + 45, {
          align: "left",
        });
        doc.text("mindsphere.services@gmail.com", 350, fromYPosition + 60, {
          align: "left",
        });
        doc.text("Website: www.mindsphere.sg", 350, fromYPosition + 75, {
          align: "left",
        });
        doc.moveDown(2);

        // Draw line separator
        doc.moveTo(50, 260).lineTo(550, 260).stroke();

        // Event Details
        const tableStartY = 280;
        doc.fontSize(12).font("Helvetica-Bold").text("Item", 50, tableStartY);
        doc.text("Quantity", 200, tableStartY, { align: "center" });
        doc.text("Price", 325, tableStartY, { align: "center" });
        doc.text("Amount", 450, tableStartY, { align: "center" });
        doc
          .font("Helvetica")
          .moveTo(50, tableStartY + 20)
          .lineTo(550, tableStartY + 20)
          .stroke();
        doc.moveDown(1);

        const price = eventDetails.price.toFixed(2);
        const amount = (quantity * eventDetails.price).toFixed(2);

        doc.fontSize(12).text(eventDetails.title, 50, tableStartY + 30);
        doc.text(quantity.toString(), 200, tableStartY + 30, {
          align: "center",
        });
        doc.text(`$${price}`, 325, tableStartY + 30, { align: "center" });
        doc.text(`$${amount}`, 450, tableStartY + 30, { align: "center" });
        doc.moveDown(2);

        // Draw line separator
        doc
          .moveTo(50, tableStartY + 60)
          .lineTo(550, tableStartY + 60)
          .stroke();

        // Summary Section
        const subtotal = parseFloat(amount);
        const tax = 0; // Tax is 0%
        const total = subtotal + tax;

        doc
          .fontSize(12)
          .font("Helvetica-Bold")
          .text("Subtotal", 350, tableStartY + 80, { align: "left" });
        doc
          .fontSize(12)
          .font("Helvetica")
          .text(`$${subtotal.toFixed(2)}`, 450, tableStartY + 80, {
            align: "center",
          });

        doc
          .fontSize(12)
          .font("Helvetica-Bold")
          .text("Tax (0%)", 350, tableStartY + 100, { align: "left" });
        doc
          .fontSize(12)
          .font("Helvetica")
          .text(`$${tax.toFixed(2)}`, 450, tableStartY + 100, {
            align: "center",
          });

        doc
          .fontSize(12)
          .font("Helvetica-Bold")
          .text("Total", 350, tableStartY + 120, { align: "left" });
        doc
          .fontSize(12)
          .font("Helvetica")
          .text(`$${total.toFixed(2)}`, 450, tableStartY + 120, {
            align: "center",
          });
        doc.font("Helvetica").moveDown(2);

        // Payment Method Section
        doc.fontSize(12).text("Payment method: PayNow", 50, tableStartY + 150, {
          align: "left",
        });
        doc.moveDown(2);

        // Footer
        doc
          .fontSize(10)
          .text(
            "60 Paya Lebar Road, #07-54 Paya Lebar Square, Singapore 409501",
            {
              align: "center",
            }
          );
        doc.moveDown();
        doc.text("Thank you for choosing Mindsphere!", { align: "center" });
        doc.moveDown();
        doc.text(
          "Copyright © 2024 Mindsphere Singapore Pte. Ltd. All rights reserved.",
          {
            align: "center",
          }
        );

        // End the document
        doc.end();
      });

      // Upload PDF to S3
      const uploadParams = {
        Bucket: "mindsphere-s3",
        Key: `invoice/Invoice_${memberEventID}.pdf`,
        Body: pdfBuffer,
        ContentType: "application/pdf",
        ACL: "private",
      };

      try {
        const command = new PutObjectCommand(uploadParams);
        await S3Client.send(command);
        console.log(`[DEBUG] PDF uploaded successfully to S3`);

        // Return the S3 key as a result
        return uploadParams.Key;
      } catch (error) {
        console.error("[DEBUG] Error uploading PDF to S3:", error);
        throw error;
      }
    } catch (error) {
      console.error("[DEBUG] Error in generateInvoicePDF:", error);
      throw error; // Re-throw the error to handle it in the caller function
    }
  }

  static async viewInvoice(req, res) {
    console.log("[DEBUG] Viewing PDF invoice...");

    try {
      const { eventDetails, participantsData, memberDetails, memberEventID } =
        req.body;

      if (
        !eventDetails ||
        !participantsData ||
        !memberDetails ||
        !memberEventID
      ) {
        return res.status(400).json({
          message:
            "Missing required fields: eventDetails, participantsData, memberDetails, or memberEventID.",
        });
      }

      console.log(participantsData);
      console.log(eventDetails);

      // Call the static method using the class name
      const s3Key = await EventController.generateInvoicePDF(
        eventDetails,
        participantsData,
        memberDetails,
        memberEventID
      );

      // Construct the S3 file URL (adjust for your S3 setup)
      const s3Url = `https://mindsphere-s3.s3.amazonaws.com/${s3Key}`;

      console.log(`[DEBUG] Invoice available at: ${s3Url}`);

      // Return the URL for the client to open
      return res.status(200).json({
        message: "Invoice generated successfully.",
        url: s3Url,
      });
    } catch (error) {
      console.error("[DEBUG] Error in viewInvoice:", error);
      return res
        .status(500)
        .json({ message: "Error generating or viewing the invoice.", error });
    }
  }

  static sendInvoiceEmail = async (req, res) => {
    const {
      eventID,
      participantsData,
      memberEventID,
      recipientEmail,
      memberDetails,
    } = req.body;
    console.log("[DEBUG] Starting invoice email process...");

    try {
      console.log(`[DEBUG] Fetching event details for eventID: ${eventID}`);
      const eventDetails = await Event.getEventDetailsForInvoice(eventID);

      // Generate PDF invoice and get the PDF key
      console.log(`[DEBUG] Generating invoice PDF...`);
      const pdfKey = await EventController.generateInvoicePDF(
        eventDetails,
        participantsData,
        memberDetails, // Pass memberDetails here
        memberEventID
      );
      console.log(`[DEBUG] PDF generation completed. pdfKey: ${pdfKey}`);

      // Send email with the invoice, passing the correct PDF key
      console.log(`[DEBUG] Sending invoice to email: ${recipientEmail}`);
      const emailService = new EmailService();
      await emailService.sendPaymentConfirmation(
        recipientEmail,
        pdfKey,
        participantsData,
        eventDetails
      );

      res.status(200).json({ message: "Invoice sent successfully!" });
    } catch (error) {
      console.error("[DEBUG] Error sending invoice email:", error);
      res.status(500).send("Error sending invoice email");
    }
  };

  static uploadImage = async (req, res) => {
    const { base64Image, fileName } = req.body;

    if (!base64Image || !fileName) {
      return res
        .status(400)
        .json({ error: "Image data or file name is missing" });
    }

    try {
      // Decode base64 image data
      const base64Data = Buffer.from(
        base64Image.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );

      // Convert the image to JPG format using sharp
      const convertedImageBuffer = await sharp(base64Data)
        .jpeg() // Convert to JPG format
        .toBuffer();

      // Set up S3 upload parameters
      const s3FileName = `images/event/${Date.now()}_${fileName}.jpg`; // Ensure filename ends with .jpg
      const uploadParams = {
        Bucket: "mindsphere-s3",
        Key: s3FileName,
        Body: convertedImageBuffer, // Use the converted buffer
        ContentType: "image/jpeg", // Set content type to JPG
      };

      // Upload the image to S3
      const command = new PutObjectCommand(uploadParams);
      await S3Client.send(command);

      const imageUrl = `https://${uploadParams.Bucket}.s3.amazonaws.com/${s3FileName}`;
      res.json({ imageUrl }); // Respond with the S3 URL of the uploaded image
    } catch (error) {
      console.error("Error uploading to S3:", error);
      res.status(500).send("Failed to upload image");
    }
  };
  static addFeedback = async (req, res) => {
    const {
      memberEventID,
      experience,
      pace,
      liked,
      disliked,
      additionalComments,
    } = req.body;

    console.log("[DEBUG] Received feedback data:", {
      memberEventID,
      experience,
      pace,
      liked,
      disliked,
      additionalComments,
    });

    try {
      // Validate required fields
      if (!memberEventID || !experience || !pace) {
        return res.status(400).json({
          success: false,
          message:
            "Required fields (memberEventID, experience, pace) are missing.",
        });
      }

      // Construct feedback data object
      const feedbackData = {
        experience,
        pace,
        liked,
        disliked,
        additionalComments,
      };

      // Call the model function to add feedback
      const result = await Event.addFeedback(memberEventID, feedbackData);

      console.log("[DEBUG] Feedback added successfully:", result);
      res.status(200).json({
        success: true,
        message: "Feedback added successfully.",
      });
    } catch (error) {
      console.error("[DEBUG] Error adding feedback:", error.message);
      res.status(500).json({
        success: false,
        message: "Failed to add feedback. Please try again later.",
      });
    }
  };

  // Controller method to handle fetching events by availableDates
  static getEventsByAvailableDates = async (req, res) => {
    const { availableDates } = req.query; // Assuming availableDates is passed as a query parameter

    try {
      const events = await Event.getEventByAvailableDates(availableDates); // Call the model method
      res.status(200).json(events); // Return the list of events as JSON
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to retrieve events", error: error.message });
    }
  };
}

// ========== Export ==========
module.exports = EventController;
