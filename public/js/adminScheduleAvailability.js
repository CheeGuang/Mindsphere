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

  // Initialize Calendly Widget or Show Instructions
  function initCalendlyWidget(link) {
    // Remove the existing Calendly widget container if it exists
    $("#calendly-inline-widget").remove();

    // Re-create the widget container and insert it above the "Done" button
    $("<div>", {
      id: "calendly-inline-widget",
      style: "min-width: 320px; height: 670px",
    }).insertBefore("#done-button");

    // Initialize the Calendly widget with the new link
    Calendly.initInlineWidget({
      url: link,
      parentElement: document.getElementById("calendly-inline-widget"),
    });
  }

  const adminDetails = localStorage.getItem("adminDetails");
  const calendlyLink = adminDetails
    ? JSON.parse(adminDetails).calendlyLink
    : null;

  if (calendlyLink) {
    initCalendlyWidget(calendlyLink); // Load Calendly widget if the link exists
    $("#calendly-section").show();
  } else {
    $("#calendly-section").hide(); // Hide Calendly section if link is missing
  }

  // Event Listener for Calendly Link Submission
  $("#calendly-submit-button").on("click", function () {
    const newCalendlyLink = $("#calendly-link-input").val();

    // Submit new Calendly link to the server
    $.ajax({
      url: `/api/admin/update-calendly-link`,
      method: "PUT",
      data: JSON.stringify({
        adminID: JSON.parse(adminDetails).adminID,
        calendlyLink: newCalendlyLink,
      }),
      contentType: "application/json",
      success: function () {
        showCustomAlert("Calendly link updated successfully!");

        // Fetch updated admin details and reload Calendly widget
        fetchAdminDetails(JSON.parse(adminDetails).adminID);
      },
      error: function (xhr, status, error) {
        console.error("Error updating Calendly link:", error);
        showCustomAlert("Failed to update Calendly link. Please try again.");
      },
    });
  });

  // Event Listener for Calendly Access Token Submission
  $("#calendly-token-submit-button").on("click", function () {
    const newCalendlyToken = $("#calendly-token-input").val();

    // Submit new Calendly access token to the server
    $.ajax({
      url: `/api/admin/update-calendly-access-token`,
      method: "PUT",
      data: JSON.stringify({
        adminID: JSON.parse(adminDetails).adminID,
        newAccessToken: newCalendlyToken,
      }),
      contentType: "application/json",
      success: function () {
        showCustomAlert("Calendly Access Token updated successfully!");
        // Optionally, fetch updated admin details or reload if needed
        fetchAdminDetails(JSON.parse(adminDetails).adminID);
      },
      error: function (xhr, status, error) {
        console.error("Error updating Calendly Access Token:", error);
        showCustomAlert(
          "Failed to update Calendly Access Token. Please try again."
        );
      },
    });
  });

  // Function to fetch admin details by adminID and store them in localStorage
  function fetchAdminDetails(adminID) {
    fetch(`/api/admin/admin-details/${adminID}`)
      .then((response) => response.json())
      .then((adminDetails) => {
        // Store admin details directly in localStorage under the key 'adminDetails'
        localStorage.setItem("adminDetails", JSON.stringify(adminDetails.data));

        // Reload Calendly widget with new link
        if (adminDetails.data.calendlyLink) {
          $("#calendly-section").show();
          initCalendlyWidget(adminDetails.data.calendlyLink);
        } else {
          $("#calendly-section").hide();
        }
      })
      .catch((error) => {
        console.error("Error fetching admin details:", error);
      });
  }

  // Add Event Listener for Booking Completion
  window.addEventListener("message", function (event) {
    if (event.data.event && event.data.event === "calendly.event_scheduled") {
      const selectedDateTime = new Date(
        event.data.payload.event.start_time
      ).toISOString();
      console.log("Selected Date & Time (ISO):", selectedDateTime);
    }
  });

  // Event listener for the Done button to redirect to adminHome.html
  $("#done-button").on("click", function () {
    window.location.href = "adminHome.html";
  });
});
