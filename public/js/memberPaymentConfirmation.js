$(document).ready(async function () {
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

  const urlParams = new URLSearchParams(window.location.search);
  let enrollmentData = null;

  // If no query parameters are present, retrieve data from sessionStorage
  if (!urlParams.has("data")) {
    // Retrieve memberEventID and total price from sessionStorage
    const memberEventID = sessionStorage.getItem("memberEventID");
    const selectedEventDetails = sessionStorage.getItem("selectedEventDetails");
    const participantsData = sessionStorage.getItem("participantsData");

    if (memberEventID && selectedEventDetails && participantsData) {
      // Use the stored data to populate the UI
      const eventDetails = JSON.parse(selectedEventDetails);
      const totalPrice =
        eventDetails.price * JSON.parse(participantsData).length;

      // Display memberEventID and total price
      $("#order-number").text(memberEventID);
      $("#total-amount").text(`$${totalPrice.toFixed(2)}`);
    } else {
      console.error("No enrollment data found in sessionStorage.");
    }

    // End the function here if no query parameters are present
    return;
  }

  // If URL has 'data' parameter, proceed with enrollment
  if (urlParams.has("data")) {
    enrollmentData = JSON.parse(decodeURIComponent(urlParams.get("data")));

    // Store the data in sessionStorage for future use
    sessionStorage.setItem(
      "participantsData",
      JSON.stringify(enrollmentData.participantsData)
    );
  } else {
    // If 'data' is not in the URL, try retrieving from sessionStorage
    const participantsData = sessionStorage.getItem("participantsData");
    const selectedEventDetails = sessionStorage.getItem("selectedEventDetails");

    if (participantsData && selectedEventDetails) {
      enrollmentData = {
        participantsData: JSON.parse(participantsData),
        selectedEventDetails: JSON.parse(selectedEventDetails),
      };
    } else {
      // If no data in URL or sessionStorage, show error and exit
      console.error("No enrollment data found.");
      return;
    }
  }

  // Helper function to calculate total price
  function calculateTotalPrice(pricePerParticipant, participantsData) {
    const numberOfParticipants = participantsData ? participantsData.length : 0;
    return pricePerParticipant * numberOfParticipants;
  }

  if (enrollmentData) {
    const { memberID, eventID, participantsData } = enrollmentData;
    let pricePerParticipant = 0;

    // Check if sessionStorage has selectedEventDetails
    const selectedEventDetails = sessionStorage.getItem("selectedEventDetails");

    if (!selectedEventDetails) {
      // If selectedEventDetails is missing, fetch event details by eventID
      try {
        const response = await $.ajax({
          url: `${window.location.origin}/api/event/get-event-by-id/${eventID}`,
          method: "GET",
        });

        if (response) {
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
        console.error("Error fetching event details by event ID:", error);
      }
    } else {
      // If selectedEventDetails exists, use the stored price
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
          console.error("FullName is missing for participant:", participant);
          continue;
        }

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

        console.log(response);

        if (response.success && response.memberEventID) {
          console.log(`${fullName} enrolled successfully.`);

          // Store memberEventID in sessionStorage for future reference
          sessionStorage.setItem("memberEventID", response.memberEventID);

          // Display the memberEventID as the order number
          $("#order-number").text(response.memberEventID);

          // Notify the server to send SSE update to all connected devices
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
              console.log("QR scan event triggered successfully:", response);
            },
            error: function (error) {
              console.error("Error triggering QR scan event:", error);
            },
          });
        } else {
          console.error(`Error enrolling ${fullName}.`);
        }
      }
    } catch (error) {
      console.error("Error during enrollment:", error);
    }
  }

  // Handle Continue Shopping button
  $("#continue-shopping-btn").click(function () {
    window.location.href = "/"; // Redirect to the homepage or a relevant page
  });
});
