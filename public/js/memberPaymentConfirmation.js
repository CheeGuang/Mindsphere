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
  const enrollmentData = JSON.parse(decodeURIComponent(urlParams.get("data")));

  if (enrollmentData) {
    const { memberID, eventID, participantsData } = enrollmentData;

    try {
      for (let participant of participantsData) {
        // Ensure fullName is properly formatted
        const fullName =
          participant.fullName ||
          `${participant.firstName} ${participant.lastName}`;

        // Check if fullName is empty
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

        if (response.success) {
          console.log(`${fullName} enrolled successfully.`);
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
