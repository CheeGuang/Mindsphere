$(document).ready(function () {
  // Load the customAlert.html into the container
  $("#customAlertContainer").load("./customAlert.html");

  // Fetch and display all business collaboration forms
  function fetchCollaborationForms() {
    $.ajax({
      url: "api/businessCollaboration", // Replace with the actual endpoint
      method: "GET",
      success: function (response) {
        const container = $("#collaborationFormsContainer");
        container.empty(); // Clear the container

        // Access the nested data property in the response
        const data = response.data;

        if (data && data.length > 0) {
          data.forEach((form) => {
            const card = `
                  <div class="col">
                    <div class="card shadow-sm h-100">
                      <div class="card-body">
                        <h5 class="card-title">${form.businessName}</h5>
                        <p class="card-text">
                          <strong>Email:</strong> ${form.businessEmail}<br />
                          <strong>Contact:</strong> ${form.contactNumber}<br />
                          <strong>Date:</strong> ${new Date(
                            form.requestedDate
                          ).toLocaleDateString()}<br />
                          <strong>Time:</strong> ${form.requestedTime}<br />
                          <strong>Venue:</strong> ${form.venue}<br />
                          <strong>Participants:</strong> ${
                            form.participants
                          }<br />
                          <strong>Lunch Needed:</strong> ${
                            form.lunchNeeded ? "Yes" : "No"
                          }<br />
                        </p>
                        <p class="card-text">
                          <strong>Description:</strong><br />
                          ${form.description}
                        </p>
                      </div>
                    </div>
                  </div>
                `;
            container.append(card);
          });
        } else {
          container.append(`<p>No business collaboration forms found.</p>`);
        }
      },
      error: function (error) {
        console.error("Error fetching collaboration forms:", error);
        showCustomAlert(
          "Failed to load collaboration forms. Please try again."
        );
      },
    });
  }

  // Fetch forms on page load
  fetchCollaborationForms();

  // Define the showCustomAlert function globally
  window.showCustomAlert = function (message, redirectUrl) {
    var $alert = $("#customAlert");
    $alert.text(message); // Update alert message
    $alert.fadeIn(); // Show the alert

    // Determine the display duration based on the presence of a redirectUrl
    var displayDuration = redirectUrl ? 1000 : 5000;

    // Hide the alert after the specified duration
    setTimeout(function () {
      $alert.fadeOut();

      // If a redirect URL is provided, navigate to it after 3 seconds
      if (redirectUrl) {
        setTimeout(function () {
          window.location.href = redirectUrl;
        }, 1000); // Allow 1 second for fade-out effect
      }
    }, displayDuration);
  };
});
