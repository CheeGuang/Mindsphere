document.querySelector("form").addEventListener("submit", async function (e) {
  e.preventDefault(); // Prevent the default form submission

  // Get memberID from local storage
  const memberID = JSON.parse(localStorage.getItem("memberDetails"))?.memberID;
  if (!memberID) {
    showCustomAlert("Member ID not found. Please ensure you are logged in.");
    return;
  }

  // Get contact number and referral code from input fields
  const contactNo = document.querySelector('input[type="tel"]').value;
  const referralCode = document.getElementById("referralCode")?.value || null;

  // Prepare data to be sent to the server
  const data = {
    memberID: memberID,
    contactNo: contactNo,
    referralCode: referralCode,
  };

  try {
    // Make an API call to update the member contact number and referral code
    const response = await fetch("/api/member/update-member-contact", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      showCustomAlert(result.message || "Contact number updated successfully.");
      // Redirect to memberHome.html after 3 seconds
      setTimeout(() => {
        window.location.href = "memberSignUpChildren.html";
      }, 3000); // 3-second delay
    } else {
      showCustomAlert(result.error || "Failed to update contact number.");
    }
  } catch (error) {
    console.error("Error updating contact number:", error);
    showCustomAlert("An error occurred while updating the contact number.");
  }
});
