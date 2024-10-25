$(document).ready(async function () {
  // Load the customAlert.html into the container
  console.log("[DEBUG] Loading customAlert.html into #customAlertContainer");
  $("#customAlertContainer").load("./customAlert.html");

  // Define the showCustomAlert function globally
  window.showCustomAlert = function (message) {
    console.log(`[DEBUG] Showing custom alert with message: ${message}`);
    var $alert = $("#customAlert");
    $alert.text(message); // Update alert message
    $alert.fadeIn(); // Show the alert

    // Automatically hide after 5 seconds (5000ms)
    setTimeout(function () {
      $alert.fadeOut();
    }, 5000);
  };

  const urlParams = new URLSearchParams(window.location.search);
  let enrollmentData = null;

  // Retrieve `memberID` from `localStorage`
  const memberID = JSON.parse(localStorage.getItem("memberDetails"))?.memberID;
  console.log(`[DEBUG] Retrieved memberID from localStorage: ${memberID}`);
  let recipientEmail = "";

  if (memberID) {
    try {
      // Fetch member details using memberID
      console.log(`[DEBUG] Fetching member details for memberID: ${memberID}`);
      const memberResponse = await $.ajax({
        url: `${window.location.origin}/api/member/member-details/${memberID}`,
        method: "GET",
      });

      console.log(memberResponse);

      // Extract email from the response
      if (memberResponse && memberResponse.data.email) {
        recipientEmail = memberResponse.data.email;
        console.log(`[DEBUG] Retrieved recipient email: ${recipientEmail}`);
      } else {
        console.error("[DEBUG] Email not found for the member.");
        return;
      }
    } catch (error) {
      console.error("[DEBUG] Error fetching member details:", error);
      return;
    }
  } else {
    console.error("[DEBUG] Member ID not found in localStorage.");
    return;
  }

  // Check if URL has query parameters
  const hasQueryParameters = urlParams.has("data");

  if (hasQueryParameters) {
    // If query parameters are present, remove ORDER NUMBER and TOTAL AMOUNT sections
    console.log(
      "[DEBUG] Query parameters detected. Removing ORDER NUMBER and TOTAL AMOUNT sections."
    );
    $(".order-summary").remove(); // Remove the entire order summary section
  }

  // If no query parameters are present, retrieve data from sessionStorage
  if (!hasQueryParameters) {
    console.log(
      "[DEBUG] No URL parameters present. Retrieving data from sessionStorage."
    );

    // Retrieve memberEventID and total price from sessionStorage
    const memberEventID = sessionStorage.getItem("memberEventID");
    const selectedEventDetails = sessionStorage.getItem("selectedEventDetails");
    const participantsData = sessionStorage.getItem("participantsData");

    if (memberEventID && selectedEventDetails && participantsData) {
      console.log("[DEBUG] Enrollment data found in sessionStorage.");
      const eventDetails = JSON.parse(selectedEventDetails);
      const totalPrice =
        eventDetails.price * JSON.parse(participantsData).length;

      // Display memberEventID and total price
      $("#order-number").text(memberEventID);
      $("#total-amount").text(`$${totalPrice.toFixed(2)}`);
    } else {
      console.error("[DEBUG] No enrollment data found in sessionStorage.");
    }

    // End the function here if no query parameters are present
    return;
  }

  // If URL has 'data' parameter, proceed with enrollment
  if (hasQueryParameters) {
    enrollmentData = JSON.parse(decodeURIComponent(urlParams.get("data")));
    console.log(
      "[DEBUG] Enrollment data retrieved from URL parameters:",
      enrollmentData
    );

    // Store the data in sessionStorage for future use
    sessionStorage.setItem(
      "participantsData",
      JSON.stringify(enrollmentData.participantsData)
    );
    console.log("[DEBUG] Stored participantsData in sessionStorage.");
  } else {
    console.log("[DEBUG] Checking for enrollment data in sessionStorage.");
    const participantsData = sessionStorage.getItem("participantsData");
    const selectedEventDetails = sessionStorage.getItem("selectedEventDetails");

    if (participantsData && selectedEventDetails) {
      enrollmentData = {
        participantsData: JSON.parse(participantsData),
        selectedEventDetails: JSON.parse(selectedEventDetails),
      };
      console.log("[DEBUG] Enrollment data found in sessionStorage.");
    } else {
      console.error("[DEBUG] No enrollment data found.");
      return;
    }
  }

  // Helper function to calculate total price
  function calculateTotalPrice(pricePerParticipant, participantsData) {
    const numberOfParticipants = participantsData ? participantsData.length : 0;
    const total = pricePerParticipant * numberOfParticipants;
    console.log(`[DEBUG] Calculated total price: $${total.toFixed(2)}`);
    return total;
  }

  if (enrollmentData) {
    const { memberID, eventID, participantsData } = enrollmentData;
    let pricePerParticipant = 0;

    // Check if sessionStorage has selectedEventDetails
    const selectedEventDetails = sessionStorage.getItem("selectedEventDetails");

    if (!selectedEventDetails) {
      // If selectedEventDetails is missing, fetch event details by eventID
      console.log(`[DEBUG] Fetching event details for eventID: ${eventID}`);
      try {
        const response = await $.ajax({
          url: `${window.location.origin}/api/event/get-event-by-id/${eventID}`,
          method: "GET",
        });

        if (response) {
          console.log("[DEBUG] Event details fetched successfully.");
          // Save fetched event details to sessionStorage for future use
          sessionStorage.setItem(
            "selectedEventDetails",
            JSON.stringify(response)
          );

          // Use the price from the fetched event details
          pricePerParticipant = response.price;

          // Calculate total price and update the UI
          const totalPrice = calculateTotalPrice(
            pricePerParticipant,
            participantsData
          );
          $("#total-amount").text(`$${totalPrice.toFixed(2)}`);
        }
      } catch (error) {
        console.error(
          "[DEBUG] Error fetching event details by event ID:",
          error
        );
      }
    } else {
      // If selectedEventDetails exists, use the stored price
      console.log("[DEBUG] Using event details from sessionStorage.");
      const eventDetails = JSON.parse(selectedEventDetails);
      pricePerParticipant = eventDetails.price;

      // Calculate total price and update the UI
      const totalPrice = calculateTotalPrice(
        pricePerParticipant,
        participantsData
      );
      $("#total-amount").text(`$${totalPrice.toFixed(2)}`);
    }

    try {
      for (let participant of participantsData) {
        // Ensure fullName is properly formatted
        const fullName =
          participant.fullName ||
          `${participant.firstName} ${participant.lastName}`;

        if (!fullName) {
          console.error(
            "[DEBUG] FullName is missing for participant:",
            participant
          );
          continue;
        }

        console.log(`[DEBUG] Enrolling participant: ${fullName}`);
        const response = await $.ajax({
          url: `${window.location.origin}/api/event/enroll-member-to-event`,
          method: "GET", // Adjust to POST if your server supports POST
          data: {
            memberID: memberID,
            eventID: eventID,
            fullName: fullName,
            age: participant.age,
            schoolName: participant.schoolName,
            interests: participant.interests,
            medicalConditions: participant.medicalConditions,
            lunchOption: participant.lunchOption,
            specifyOther: participant.specifyOther,
          },
        });

        console.log("[DEBUG] Enrollment response:", response);

        if (response.success && response.memberEventID) {
          console.log(
            `[DEBUG] ${fullName} enrolled successfully. MemberEventID: ${response.memberEventID}`
          );

          // Store memberEventID in sessionStorage for future reference
          sessionStorage.setItem("memberEventID", response.memberEventID);

          // Display the memberEventID as the order number
          $("#order-number").text(response.memberEventID);

          // Notify the server to send SSE update to all connected devices
          console.log("[DEBUG] Triggering QR scan event.");
          $.ajax({
            url: `${window.location.origin}/api/event/trigger-qr-scan`,
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
              memberID: memberID,
              eventID: eventID,
              memberEventID: response.memberEventID, // Include memberEventID
            }),
            success: function (response) {
              console.log(
                "[DEBUG] QR scan event triggered successfully:",
                response
              );
            },
            error: function (error) {
              console.error("[DEBUG] Error triggering QR scan event:", error);
            },
          });

          // After successful enrollment, generate and send invoice if not sent before
          const eventDetails = JSON.parse(
            sessionStorage.getItem("selectedEventDetails")
          );
          const participantsData = JSON.parse(
            sessionStorage.getItem("participantsData")
          );

          // Check if invoice has already been sent
          if (
            response.memberEventID &&
            participantsData &&
            eventDetails &&
            recipientEmail &&
            !sessionStorage.getItem("invoiceSent")
          ) {
            try {
              console.log("[DEBUG] Sending invoice email...");
              await $.ajax({
                url: `${window.location.origin}/api/event/send-invoice-email`,
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify({
                  eventID: eventDetails.eventID,
                  participantsData: participantsData,
                  memberEventID: response.memberEventID,
                  recipientEmail: recipientEmail,
                }),
                success: function () {
                  console.log("[DEBUG] Invoice sent successfully!");
                  // Mark invoice as sent
                  sessionStorage.setItem("invoiceSent", "true");
                },
                error: function (error) {
                  console.error("[DEBUG] Error sending invoice:", error);
                },
              });
            } catch (error) {
              console.error(
                "[DEBUG] Error triggering invoice generation:",
                error
              );
            }
          }
        } else {
          console.error(`[DEBUG] Error enrolling ${fullName}.`);
        }
      }
    } catch (error) {
      console.error("[DEBUG] Error during enrollment:", error);
    }
  }

  // Handle Continue Shopping button
  $("#continue-shopping-btn").click(function () {
    console.log(
      "[DEBUG] Continue shopping button clicked. Redirecting to homepage."
    );
    window.location.href = "/"; // Redirect to the homepage or a relevant page
  });
});
