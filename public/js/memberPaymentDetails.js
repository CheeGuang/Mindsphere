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

  // Function to generate the QR code for enrollment
  function generateEnrollmentQRCode() {
    const memberID = localStorage.getItem("memberID");
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

    // Create the payload for the QR code
    const enrollmentData = {
      memberID: memberID,
      eventID: String(eventDetails.eventID), // Convert to string
      participantsData: participantsData,
    };

    // URL for payment confirmation page with additional redirect parameter
    const paymentConfirmationURL = `${
      window.location.origin
    }/memberPaymentConfirmation.html?data=${encodeURIComponent(
      JSON.stringify(enrollmentData)
    )}`;

    console.log(
      "[DEBUG] Payment confirmation URL generated:",
      paymentConfirmationURL
    );

    // Generate the QR code using the QRCode library
    const qrCodeElement = document.getElementById("qrCodeContainer");
    qrCodeElement.innerHTML = ""; // Clear any existing QR code
    new QRCode(qrCodeElement, {
      text: paymentConfirmationURL,
      width: 350,
      height: 350,
    });

    // Debug statement for SSE connection
    console.log("[DEBUG] Establishing SSE connection...");

    // SSE to listen for QR code scan on the old device
    const eventSource = new EventSource(
      `/api/event/qr-scan-sse?memberID=${memberID}&eventID=${String(
        eventDetails.eventID
      )}`
    );

    // SSE connection opened
    eventSource.onopen = () => {
      console.log("[DEBUG] SSE connection opened successfully.");
    };

    // SSE connection error handling
    eventSource.onerror = (error) => {
      console.error("[DEBUG] SSE connection error:", error);
    };

    // Listening for 'qrScan' events from the server
    eventSource.addEventListener("qrScan", function (event) {
      console.log("[DEBUG] 'qrScan' event received:", event);

      try {
        const data = JSON.parse(event.data);
        console.log("[DEBUG] Parsed SSE data:", data);

        // Convert `memberID` and `eventID` to strings for consistent comparison
        const receivedMemberID = String(data.memberID);
        const receivedEventID = String(data.eventID);
        const localMemberID = String(memberID);
        const localEventID = String(eventDetails.eventID);

        console.log(
          `[DEBUG] Comparing receivedMemberID: ${receivedMemberID} with localMemberID: ${localMemberID}`
        );
        console.log(
          `[DEBUG] Comparing receivedEventID: ${receivedEventID} with localEventID: ${localEventID}`
        );

        if (
          data.success &&
          receivedMemberID === localMemberID &&
          receivedEventID === localEventID
        ) {
          console.log(
            "[DEBUG] Conditions met, storing memberEventID and redirecting to payment confirmation..."
          );

          // Store the received memberEventID in sessionStorage
          sessionStorage.setItem("memberEventID", data.memberEventID);

          // Redirect to the payment confirmation page
          window.location.href = `${window.location.origin}/memberPaymentConfirmation.html`;
        } else {
          console.log("[DEBUG] Conditions not met. Ignoring the event.");
        }
      } catch (parseError) {
        console.error("[DEBUG] Error parsing SSE data:", parseError);
      }
    });
  }
  // Call the function to generate the QR code
  generateEnrollmentQRCode();

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

  // Call the function to update the payment details
  updatePaymentDetails();
});
