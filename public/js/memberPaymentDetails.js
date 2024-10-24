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
      eventID: eventDetails.eventID,
      participantsData: participantsData, // Include all participant details
    };

    // URL for payment confirmation page
    const paymentConfirmationURL = `${
      window.location.origin
    }/memberPaymentConfirmation.html?data=${encodeURIComponent(
      JSON.stringify(enrollmentData)
    )}`;

    console.log(
      `${
        window.location.origin
      }/memberPaymentConfirmation.html?data=${encodeURIComponent(
        JSON.stringify(enrollmentData)
      )}`
    );

    // Generate the QR code using the QRCode library
    const qrCodeElement = document.getElementById("qrCodeContainer");
    qrCodeElement.innerHTML = ""; // Clear any existing QR code
    new QRCode(qrCodeElement, {
      text: paymentConfirmationURL,
      width: 350,
      height: 350,
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
        "Event details or participants data not found in sessionStorage"
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

    // Update the QR code amount display
    $(".qr-code-text").html(`
      Mindsphere<br />
      Amount: $${totalPrice}
    `);
  }

  // Call the function to update the payment details
  updatePaymentDetails();
});
