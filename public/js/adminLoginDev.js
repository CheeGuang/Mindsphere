document.addEventListener("DOMContentLoaded", function () {
  // Handle form submission for login
  document.querySelector("form").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form from submitting traditionally

    // Get email and password from the form fields
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Check if the email and password match the allowed credentials
    if (email === "simon.mindsphere@gmail.com" && password === "abc123") {
      // Simulate guest login by redirecting to admin home page
      fetchAdminDetails(1, "./adminHome.html"); // Call with adminID = 1 for Simon
    } else {
      // Show an error message if login failed
      showCustomAlert("Invalid email or password. Please try again.");
    }
  });
});

// Function to fetch admin details by adminID and store them in localStorage as a single JSON object
function fetchAdminDetails(adminID, redirectUrl) {
  fetch(`/api/admin/admin-details/${adminID}`)
    .then((response) => response.json())
    .then((adminDetails) => {
      // Store admin details directly in localStorage under the key 'adminDetails'
      localStorage.setItem("adminDetails", JSON.stringify(adminDetails.data));

      // Redirect to the appropriate page
      window.location.href = redirectUrl;
    })
    .catch((error) => {
      console.error("Error fetching admin details:", error);
    });
}

// Custom Alert Logic
function showCustomAlert(message) {
  var $alert = $("#customAlert");
  $alert.text(message); // Update alert message
  $alert.fadeIn(); // Show the alert

  // Automatically hide after 5 seconds (5000ms)
  setTimeout(function () {
    $alert.fadeOut();
  }, 5000);
}
