document.addEventListener("DOMContentLoaded", function () {
  // Toggle visibility of edit, save, and cancel buttons
  function toggleEditMode(fieldId) {
    const field = document.getElementById(fieldId);
    const editBtn = document.getElementById("edit" + capitalize(fieldId));
    const buttons = document.getElementById(fieldId + "Buttons");
    const input = document.getElementById(fieldId);

    if (editBtn && buttons) {
      editBtn.classList.toggle("d-none");
      buttons.classList.toggle("d-none");
      input.readOnly = !input.readOnly;
    }
  }

  // Capitalize first letter of a string
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Add event listeners to edit buttons
  ["contactNo", "firstName", "lastName", "email"].forEach((field) => {
    document
      .getElementById("edit" + capitalize(field))
      .addEventListener("click", function () {
        toggleEditMode(field);
      });

    // Save button handler
    document
      .getElementById("save" + capitalize(field))
      .addEventListener("click", function () {
        console.log(field + " saved");
        toggleEditMode(field);
        saveMemberChanges();
      });

    // Cancel button handler
    document
      .getElementById("cancel" + capitalize(field))
      .addEventListener("click", function () {
        console.log(field + " edit cancelled");
        toggleEditMode(field);
        displayMemberInfo(); // Reload from localStorage to reset changes
      });
  });

  document.getElementById("signOutBtn").addEventListener("click", function () {
    localStorage.removeItem("memberDetails");
    console.log("Signed out and memberDetails removed from local storage");

    showCustomAlert("Successfully Signed out.");

    // Wait for 1 second (1000 milliseconds) before redirecting
    setTimeout(function () {
      window.location.href = "../index.html";
    }, 1000);
  });

  // Display member information from localStorage
  displayMemberInfo();

  function displayMemberInfo() {
    const userData = JSON.parse(localStorage.getItem("memberDetails"));

    if (userData) {
      document.getElementById("firstName").value = userData.firstName;
      document.getElementById("lastName").value = userData.lastName;
      document.getElementById("email").value = userData.email;
      document.getElementById("contactNo").value = userData.contactNo;

      // Check and display membership badge with formatted date
      const membershipBadge = document.getElementById("membershipBadge");
      if (userData.membershipEndDate) {
        membershipBadge.classList.remove("d-none");

        // Convert the date to a readable format
        const expiryDate = new Date(userData.membershipEndDate);
        const options = { day: "numeric", month: "long", year: "numeric" };
        const formattedDate = expiryDate.toLocaleDateString("en-GB", options);

        membershipBadge.querySelector(
          ".membership-text"
        ).textContent = `Expires: ${formattedDate}`;
      } else {
        membershipBadge.classList.add("d-none");
      }
    }
  }

  // Collect updated data and call updateMember function
  async function saveMemberChanges() {
    const userData = JSON.parse(localStorage.getItem("memberDetails"));
    if (!userData) return;

    const memberID = userData.memberID;
    const updatedData = {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      email: document.getElementById("email").value,
      contactNo: document.getElementById("contactNo").value,
      profilePicture: JSON.parse(localStorage.getItem("memberDetails"))
        .profilePicture,
    };

    try {
      const result = await updateMember(memberID, updatedData);
      if (result) {
        // Update localStorage with new data
        localStorage.setItem(
          "memberDetails",
          JSON.stringify({ ...userData, ...updatedData })
        );
        console.log("Local storage updated with new member details.");
      }
    } catch (error) {
      console.error("Failed to save member changes:", error);
    }
  }

  async function updateMember(memberID, updatedData) {
    try {
      const response = await fetch(`/api/member/upadte-member/${memberID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update member. Status: ${response.status}`);
      }

      const result = await response.json();
      showCustomAlert("Member updated successfully");
      return result;
    } catch (error) {
      console.error("Error updating member:", error);
    }
  }

  // Display referral details
  async function displayReferralDetails() {
    const userData = JSON.parse(localStorage.getItem("memberDetails"));

    if (userData && userData.memberID) {
      try {
        // Call the /referral-details/:memberID endpoint
        const response = await fetch(
          `api/referral/referral-details/${userData.memberID}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch referral details.");
        }

        const data = await response.json();

        if (data.success) {
          // Extract referral details from the response
          const { totalUnredeemedVouchers } = data.data;

          // Set referral code
          document.getElementById("referralCode").value =
            userData.referralCode || "N/A";
        } else {
          console.error("Error fetching referral details:", data.message);
        }
      } catch (error) {
        console.error("Error in displayReferralDetails:", error.message);
      }
    } else {
      console.error("No user data or memberID found in localStorage.");
    }
  }

  // Call displayReferralDetails when DOM is fully loaded
  displayReferralDetails();

  // Get the referral code from localStorage
  const memberDetails = JSON.parse(localStorage.getItem("memberDetails"));
  const referralCode = memberDetails?.referralCode || "783291";

  // Generate the referral message
  const referralMessage = `Join Mindsphere using my referral code '${referralCode}' and get a $50 gift card! Use this link: https://mindsphere.onrender.com`;

  // Update the value of the input field
  document.getElementById("referralMessage").value = referralMessage;

  document.getElementById("shareButton").addEventListener("click", () => {
    // Show the modal
    const shareModal = new bootstrap.Modal(
      document.getElementById("shareModal")
    );
    shareModal.show();
  });

  document.getElementById("copyButton").addEventListener("click", () => {
    const messageInput = document.getElementById("referralMessage");
    navigator.clipboard.writeText(messageInput.value).then(() => {
      showCustomAlert("Referral message copied to clipboard!");
    });
  });

  document.getElementById("telegramShare").addEventListener("click", () => {
    const referralMessage = document.getElementById("referralMessage").value;
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
      referralMessage
    )}`;
    window.open(telegramUrl, "_blank");
  });

  document.getElementById("whatsappShare").addEventListener("click", () => {
    const referralMessage = document.getElementById("referralMessage").value;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
      referralMessage
    )}`;
    window.open(whatsappUrl, "_blank");
  });
});
