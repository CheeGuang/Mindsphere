document.querySelector("form").addEventListener("submit", async function (e) {
  e.preventDefault(); // Prevent the default form submission

  // Get memberID from local storage
  const memberID = localStorage.getItem("memberID");
  if (!memberID) {
    alert("Member ID not found. Please ensure you are logged in.");
    return;
  }

  // Get contact number from the input field
  const contactNo = document.querySelector('input[type="tel"]').value;

  // Prepare data to be sent to the server
  const data = {
    memberID: memberID,
    contactNo: contactNo,
  };

  try {
    // Make an API call to update the member contact number
    const response = await fetch("/api/member/update-member-contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      alert(result.message || "Contact number updated successfully.");
    } else {
      alert(result.error || "Failed to update contact number.");
    }
  } catch (error) {
    console.error("Error updating contact number:", error);
    alert("An error occurred while updating the contact number.");
  }
});