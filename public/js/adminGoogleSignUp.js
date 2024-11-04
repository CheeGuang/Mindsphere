document.querySelector("form").addEventListener("submit", async function (e) {
  e.preventDefault(); // Prevent the default form submission

  // Get adminID from local storage
  const adminID = JSON.parse(localStorage.getItem("adminDetails"))?.adminID;
  if (!adminID) {
    showCustomAlert("Admin ID not found. Please ensure you are logged in.");
    return;
  }

  // Get contact number from the input field
  const contactNo = document.querySelector('input[type="tel"]').value;

  // Prepare data to be sent to the server
  const data = {
    adminID: adminID,
    contactNo: contactNo,
  };

  try {
    // Make an API call to update the admin contact number
    const response = await fetch("/api/admin/update-admin-contact", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      showCustomAlert(result.message || "Contact number updated successfully.");
      // Redirect to adminHome.html after 3 seconds
      setTimeout(() => {
        window.location.href = "adminHome.html";
      }, 1000);
    } else {
      showCustomAlert(result.error || "Failed to update contact number.");
    }
  } catch (error) {
    console.error("Error updating contact number:", error);
    showCustomAlert("An error occurred while updating the contact number.");
  }
});
