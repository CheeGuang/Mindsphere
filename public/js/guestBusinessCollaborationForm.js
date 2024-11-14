document.addEventListener("DOMContentLoaded", function () {
  // Select the form and submit button
  const form = document.querySelector(".card");
  const submitButton = form.querySelector('button[type="submit"]');

  // Event listener for form submission
  submitButton.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent the default form submission

    // Collect form data
    const businessName = document.getElementById("businessName").value.trim();
    const contactNumber = document.getElementById("contactNumber").value.trim();
    const businessEmail = document.getElementById("businessEmail").value.trim();
    const requestedDate = document.getElementById("requestedDate").value.trim();
    const requestedTime = document.getElementById("time").value.trim();
    const venue = document.getElementById("venue").value.trim();
    const description = document.getElementById("description").value.trim();
    const participants = document.getElementById("participants").value.trim();
    const lunchNeeded = document.getElementById("lunchNeeded").value;

    // Validate form data
    if (
      !businessName ||
      !contactNumber ||
      !businessEmail ||
      !requestedDate ||
      !requestedTime ||
      !venue ||
      !description ||
      !participants
    ) {
      showCustomAlert("Please fill in all the required fields.");
      return;
    }

    // Prepare data payload
    const payload = {
      businessName,
      contactNumber,
      businessEmail,
      requestedDate,
      requestedTime,
      venue,
      description,
      participants: parseInt(participants, 10),
      lunchNeeded: lunchNeeded === "Yes",
    };

    // Send POST request
    fetch("api/businessCollaboration/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to submit the form. Please try again.");
        }
        return response.json();
      })
      .then((data) => {
        // Handle the response data if needed
        console.log("Server response:", data);

        // Show success message or redirect
        showCustomAlert("Request submitted successfully!", "/success");
      })
      .catch((error) => {
        // Show error message
        console.error("Error:", error);
        showCustomAlert("An error occurred. Please try again.");
      });
  });
});
