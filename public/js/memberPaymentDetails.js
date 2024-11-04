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
    const { memberID, eventID } = parsedData;

    // Store memberID and eventID in sessionStorage for later use
    sessionStorage.setItem("memberID", memberID);
    sessionStorage.setItem("eventID", eventID);

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
          )}`;
          window.location.href = paymentConfirmationURL;
        },
        error: function (error) {
          console.error("[DEBUG] Error triggering QR scan event:", error);
        },
      });
    });
  } else {
    // If qrData is not present, this is the main device
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

      // Create the payload for the QR code with only memberID and eventID
      const qrData = {
        memberID: memberID,
        eventID: String(eventDetails.eventID), // Convert to string
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

            // Create the payload for payment confirmation
            const enrollmentData = {
              memberID: memberID,
              eventID: String(eventDetails.eventID),
              participantsData: participantsData,
            };

            // URL for payment confirmation page
            const paymentConfirmationURL = `${
              window.location.origin
            }/memberPaymentConfirmation.html?data=${encodeURIComponent(
              JSON.stringify(enrollmentData)
            )}`;

            // Redirect to payment confirmation page
            window.location.href = paymentConfirmationURL;
          }
        } catch (error) {
          console.error("[DEBUG] Error parsing SSE data:", error);
        }
      });
    }

    // Function to dynamically update the title and price
    function updatePaymentDetails() {
      // Retrieve data from sessionStorage
      const eventDetails = JSON.parse(
        sessionStorage.getItem("selectedEventDetails")
      );
      const participantsData = JSON.parse(
        sessionStorage.getItem("participantsData")
      );

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

      // Debug statement for total price calculation
      console.log("[DEBUG] Total price calculated:", totalPrice);

      // Update the QR code amount display
      $(".qr-code-text").html(`
        Mindsphere<br />
        Amount: $${totalPrice}
      `);
    }

    // Call the function to generate the QR code on the main device
    generateEnrollmentQRCode();
  }
});
