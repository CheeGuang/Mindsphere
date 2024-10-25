// ========== Models ==========
const Event = require("../../models/event");
const Member = require("../../models/member");
const EmailService = require("../../models/emailService");
const express = require("express");
const EventEmitter = require("events");
const pdfkit = require("pdfkit");
const fs = require("fs");
const path = require("path");

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

  // Event function handler to get events by member ID
  static getEventByMemberId = async (req, res) => {
    const memberID = req.params.memberId; // Use console.log here to debug
    console.log("Received memberID:", memberID);

    try {
      const events = await Event.getEventByMemberId(memberID);
      if (events.length > 0) {
        res.json(events);
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

  // Event function handler to enroll a member to an event using GET parameters
  static enrollMemberToEvent = async (req, res) => {
    // Use req.query instead of req.body for GET request parameters
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
    } = req.query;

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

      // If enrollment is successful, respond with success and memberEventID
      res.status(200).json(response);
    } catch (error) {
      console.error("Error enrolling member to event:", error);
      res.status(500).send("Error enrolling member to event");
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

  // Endpoint to trigger the QR scan event
  static triggerQRScan = (req, res) => {
    const { memberID, eventID, memberEventID } = req.body;

    if (!memberID || !eventID || !memberEventID) {
      console.error(
        "[DEBUG] Missing memberID, eventID, or memberEventID in triggerQRScan."
      );
      return res
        .status(400)
        .json({ error: "memberID, eventID, and memberEventID are required." });
    }

    console.log(
      "[DEBUG] Triggering QR scan event with memberID:",
      memberID,
      "(type:",
      typeof memberID,
      "), eventID:",
      eventID,
      "(type:",
      typeof eventID,
      "), and memberEventID:",
      memberEventID
    );

    // Emit the qrScan event with memberID, eventID, and memberEventID
    qrScanEmitter.emit("qrScan", {
      success: true,
      memberID,
      eventID,
      memberEventID,
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
  static getEventById = async (req, res) => {
    const eventID = req.params.eventId; // Retrieve eventID from URL parameter

    try {
      const event = await Event.getEventById(eventID);

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

  // Generate PDF invoice for the event using member details
  static async generateInvoicePDF(
    eventDetails,
    participantsData,
    memberEventID
  ) {
    console.log("[DEBUG] Generating PDF invoice...");

    const doc = new pdfkit();
    const pdfPath = path.join(
      __dirname,
      `../../data/invoice/Invoice_${memberEventID}.pdf`
    );
    const stream = fs.createWriteStream(pdfPath);
    doc.pipe(stream);

    try {
      // Retrieve member details by memberEventID using Member model
      const memberDetails = await Member.getMemberDetailsByMemberEventID(
        memberEventID
      );

      if (!memberDetails) {
        throw new Error(
          "Member details not found for the provided memberEventID."
        );
      }

      // Calculate the number of participants
      const quantity = participantsData.length; // Number of participants

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
      doc.fontSize(12).text(`Date: ${currentDate}`, 50, 110, { align: "left" });
      doc.moveDown(1);

      // Billed To (Member Details) with additional rows
      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("Billed to:", 50, 150, { align: "left" });
      doc
        .fontSize(12)
        .font("Helvetica")
        .text(`${memberDetails.fullName}`, 50, 165, { align: "left" });
      doc.text(`${memberDetails.email}`, 50, 180, { align: "left" });
      doc.text("123 Anywhere St., Any City", 50, 195, { align: "left" });
      doc.text("Phone: 123-456-7890", 50, 210, { align: "left" }); // Additional placeholder for phone
      doc.text("Fax: 098-765-4321", 50, 225, { align: "left" }); // Additional placeholder for fax

      // From Mindsphere (Aligned right) with additional rows
      const fromYPosition = 150; // Base Y position for "From" details
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
      doc.text("Singapore 409501", 350, fromYPosition + 45, { align: "left" });
      doc.text("mindsphere.services@gmail.com", 350, fromYPosition + 60, {
        align: "left",
      });
      doc.text("Website: www.mindsphere.sg", 350, fromYPosition + 75, {
        align: "left",
      }); // Additional placeholder for website
      doc.moveDown(2);

      // Draw line separator
      doc.moveTo(50, 260).lineTo(550, 260).stroke();

      // Event Details (Workshop) - Start table lower
      const tableStartY = 280; // Lowered table starting point
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
      doc.text(quantity.toString(), 200, tableStartY + 30, { align: "center" });
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

      doc.end();

      // Return path to the PDF for email attachment
      return new Promise((resolve, reject) => {
        stream.on("finish", () => {
          console.log(`[DEBUG] PDF generated successfully at path: ${pdfPath}`);
          resolve(pdfPath);
        });
        stream.on("error", (error) => {
          console.error("[DEBUG] Error generating PDF:", error);
          reject(error);
        });
      });
    } catch (error) {
      console.error("[DEBUG] Error in generateInvoicePDF:", error);
      throw error;
    }
  }

  // Endpoint to generate PDF and send email
  static sendInvoiceEmail = async (req, res) => {
    const { eventID, participantsData, memberEventID, recipientEmail } =
      req.body;
    console.log("[DEBUG] Starting invoice email process...");

    try {
      // Fetch event details
      console.log(`[DEBUG] Fetching event details for eventID: ${eventID}`);
      const eventDetails = await Event.getEventDetailsForInvoice(eventID);

      // Generate PDF invoice
      const pdfPath = await EventController.generateInvoicePDF(
        eventDetails,
        participantsData,
        memberEventID
      );

      // Send email with the invoice
      console.log(`[DEBUG] Sending invoice to email: ${recipientEmail}`);
      const emailService = new EmailService();
      await emailService.sendPaymentConfirmation(
        recipientEmail,
        pdfPath,
        participantsData,
        eventDetails
      );

      res.status(200).json({ message: "Invoice sent successfully!" });
    } catch (error) {
      console.error("[DEBUG] Error sending invoice email:", error);
      res.status(500).send("Error sending invoice email");
    }
  };
}

// ========== Export ==========
module.exports = EventController;
