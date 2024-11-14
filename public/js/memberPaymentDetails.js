$(document).ready(function () {
  // Load the customAlert.html into the container
  $("#customAlertContainer").load("./customAlert.html");

  // Define the showCustomAlert function globally
  window.showCustomAlert = function (message) {
    var $alert = $("#customAlert");
    $alert.text(message); // Update alert message
    $alert.fadeIn(); // Show the alert

    // Automatically hide after 5 seconds (5000ms)
    setTimeout(function () {
      $alert.fadeOut();
    }, 5000);
  };

  // Check for qrData in the URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const qrData = urlParams.get("qrData");

  if (qrData) {
    // If qrData is present, this is the scanning device
    const parsedData = JSON.parse(decodeURIComponent(qrData));
    const { memberID, eventID, participantNo, voucherValue } = parsedData;

    // Store memberID and eventID in sessionStorage for later use
    sessionStorage.setItem("memberID", memberID);
    sessionStorage.setItem("eventID", eventID);

    // Fetch the event price and calculate the amount to pay
    $.ajax({
      url: `${window.location.origin}/api/event/get-event/${eventID}`, // Fetch event details
      method: "GET",
      success: function (response) {
        const pricePerParticipant = response[0].price; // Assuming response contains the price
        const totalAmount = pricePerParticipant * participantNo; // Total before voucher
        const finalAmount = totalAmount - voucherValue; // Apply voucher value

        // Update the "Amount to Pay" display
        $(".final-amount").text(`$${finalAmount}`);

        console.log("[DEBUG] Calculated final amount to pay:", finalAmount);

        // Display the "Confirm Payment" button for scanning devices
        const confirmButtonHTML = `
          <button id="confirm-payment-btn" class="btn btn-success mt-4">Confirm Payment</button>
        `;
        $("#qrCodeContainer").html(confirmButtonHTML);

        // Event listener for confirm payment button
        $("#confirm-payment-btn").click(function () {
          $.ajax({
            url: `${window.location.origin}/api/event/trigger-qr-scan?memberID=${memberID}&eventID=${eventID}`, // Send as query parameters
            method: "POST",
            success: function (response) {
              console.log(
                "[DEBUG] QR scan event triggered successfully:",
                response
              );

              // Redirect to the payment confirmation page
              const enrollmentData = { memberID, eventID };
              const paymentConfirmationURL = `${
                window.location.origin
              }/memberPaymentConfirmation.html?data=${encodeURIComponent(
                JSON.stringify(enrollmentData)
              )}&participantNo=${participantNo}&voucherValue=${voucherValue}`;
              window.location.href = paymentConfirmationURL;
            },
            error: function (error) {
              console.error("[DEBUG] Error triggering QR scan event:", error);
            },
          });
        });
      },
      error: function (error) {
        console.error("[DEBUG] Error fetching event details:", error);
        showCustomAlert("Failed to retrieve event details. Please try again.");
      },
    });
  } else {
    function generateEnrollmentQRCode() {
      const memberID = JSON.parse(
        localStorage.getItem("memberDetails")
      )?.memberID;
      const eventDetails = JSON.parse(
        sessionStorage.getItem("selectedEventDetails")
      );
      const participantsData = JSON.parse(
        sessionStorage.getItem("participantsData")
      );

      if (!memberID || !eventDetails || !participantsData) {
        console.error(
          "Required data not found in sessionStorage or localStorage."
        );
        showCustomAlert(
          "Missing event or participant data. Please check and try again."
        );
        return;
      }

      // Retrieve voucher details if available
      const redeemedVoucherDetails = sessionStorage.getItem(
        "redeemedVoucherDetails"
      );
      let voucherValue = 0; // Default voucher value
      if (redeemedVoucherDetails) {
        const parsedVoucherDetails = JSON.parse(redeemedVoucherDetails);
        voucherValue = parsedVoucherDetails.redeemedVoucherValue || 0;
      }

      // Create the payload for the QR code, including voucher details
      const qrData = {
        memberID: memberID,
        eventID: String(eventDetails.eventID), // Convert to string
        participantNo: participantsData.length,
        voucherValue: voucherValue, // Include voucher value
      };

      const qrCodeURL = `${
        window.location.origin
      }/memberPaymentDetails.html?qrData=${encodeURIComponent(
        JSON.stringify(qrData)
      )}`;

      console.log("[DEBUG] QR code URL generated:", qrCodeURL);

      // Generate the QR code using the QRCode library
      const qrCodeElement = document.getElementById("qrCodeContainer");
      qrCodeElement.innerHTML = ""; // Clear any existing QR code
      new QRCode(qrCodeElement, {
        text: qrCodeURL,
        width: 350,
        height: 350,
      });

      // Update payment details
      updatePaymentDetails(); // Call to update title and price

      // SSE to listen for QR code scan on the main device
      const eventSource = new EventSource(
        `/api/event/qr-scan-sse?memberID=${memberID}&eventID=${String(
          eventDetails.eventID
        )}`
      );

      eventSource.onopen = () => {
        console.log("[DEBUG] SSE connection opened successfully.");
      };

      eventSource.onerror = (error) => {
        console.error("[DEBUG] SSE connection error:", error);
      };

      eventSource.addEventListener("qrScan", function (event) {
        console.log("[DEBUG] 'qrScan' event received:", event);

        try {
          const data = JSON.parse(event.data);
          if (
            data.success &&
            data.memberID == memberID &&
            data.eventID == eventDetails.eventID
          ) {
            console.log("[DEBUG] Redirecting to payment confirmation...");

            let redeemedVoucherID;

            try {
              const redeemedVoucherDetails = sessionStorage.getItem(
                "redeemedVoucherDetails"
              );

              if (!redeemedVoucherDetails) {
              }

              redeemedVoucherID = JSON.parse(
                redeemedVoucherDetails
              ).redeemedVoucherID;

              if (!redeemedVoucherID) {
                throw new Error(
                  "redeemedVoucherID is missing in the parsed data."
                );
              }
            } catch (error) {
              // Handle the error appropriately, e.g., show an alert or redirect the user
              showCustomAlert(
                "Failed to retrieve voucher details. Please try again."
              );
              // Optionally, you can redirect the user to a safer page if needed:
              // window.location.href = "/error-page";
            }

            const enrollmentData = {
              memberID: memberID,
              eventID: String(eventDetails.eventID),
              participantsData: participantsData,
              redeemedVoucherID: redeemedVoucherID,
            };

            const paymentConfirmationURL = `${
              window.location.origin
            }/memberPaymentConfirmation.html?data=${encodeURIComponent(
              JSON.stringify(enrollmentData)
            )}`;

            window.location.href = paymentConfirmationURL;
          }
        } catch (error) {
          console.error("[DEBUG] Error parsing SSE data:", error);
        }
      });
    }

    function updatePaymentDetails() {
      // Retrieve data from sessionStorage
      const eventDetails = JSON.parse(
        sessionStorage.getItem("selectedEventDetails")
      );
      const participantsData = JSON.parse(
        sessionStorage.getItem("participantsData")
      );
      const queryString = new URLSearchParams(window.location.search);
      const data = JSON.parse(decodeURIComponent(queryString.get("data")));

      if (!eventDetails || !participantsData) {
        console.error(
          "[DEBUG] Event details or participants data not found in sessionStorage"
        );
        return;
      }

      // Calculate the total cost based on the number of participants
      const title = eventDetails.title;
      const pricePerParticipant = eventDetails.price;
      const numberOfParticipants = participantsData.length;
      const totalPrice = pricePerParticipant * numberOfParticipants;

      // Update the workshop information and total price dynamically
      $(".workshop-info").text(
        `${title} ($${pricePerParticipant}) x${numberOfParticipants}`
      );
      $(".total-price").text(`$${totalPrice}`);

      // Retrieve voucher details from sessionStorage if available
      const redeemedVoucherDetails = JSON.parse(
        sessionStorage.getItem("redeemedVoucherDetails")
      );
      let voucherValue = 0; // Default voucher value

      if (redeemedVoucherDetails) {
        voucherValue = redeemedVoucherDetails.redeemedVoucherValue || 0;
      }

      // If voucherValue is null or 0, hide the gift card section
      if (voucherValue == null || voucherValue === 0) {
        $("#gift-card-section").hide(); // Hide gift card section
      } else {
        // Show gift card section and update voucher value
        $("#gift-card-title").text("Gift Card:");
        $("#gift-card-value-text").text(`-$${voucherValue}`);
        $("#gift-card-section").show(); // Show gift card section
      }

      // Calculate the final price after applying voucher value
      const finalPrice = totalPrice - voucherValue;

      // Update the "Amount to Pay" display
      $(".final-amount").text(`$${finalPrice}`);

      // Debug statement for price adjustments
      console.log("[DEBUG] Final price calculated:", finalPrice);

      // Update sessionStorage with the final price for payment confirmation
      const updatedEventDetails = {
        ...eventDetails,
        finalPrice, // Add the calculated final price
      };
      sessionStorage.setItem(
        "selectedEventDetails",
        JSON.stringify(updatedEventDetails)
      );

      // Update the QR code amount display
      $(".qr-code-text").html(`
        Mindsphere<br />
        Amount to Pay: $${finalPrice}
      `);
    }

    // Call the function to generate the QR code on the main device
    generateEnrollmentQRCode();
  }
});
