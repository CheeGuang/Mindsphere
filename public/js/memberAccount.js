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
  ["profilePicture", "contactNo", "firstName", "lastName", "email"].forEach((field) => {
    document.getElementById("edit" + capitalize(field)).addEventListener("click", function () {
      toggleEditMode(field);
    });

    // Save button handler
    document.getElementById("save" + capitalize(field)).addEventListener("click", function () {
      console.log(field + " saved");
      toggleEditMode(field);
      saveMemberChanges();
    });

    // Cancel button handler
    document.getElementById("cancel" + capitalize(field)).addEventListener("click", function () {
      console.log(field + " edit cancelled");
      toggleEditMode(field);
      displayMemberInfo(); // Reload from localStorage to reset changes
    });
  });

  document.getElementById("signOutBtn").addEventListener("click", function () {
    localStorage.removeItem("memberDetails");
    console.log("Signed out and memberDetails removed from local storage");

    showCustomAlert("Successfully Signed out.");

    // Wait for 3 seconds (3000 milliseconds) before redirecting
    setTimeout(function () {
      window.location.href = "../index.html";
    }, 3000);
  });

  // Display member information from localStorage
  displayMemberInfo();

  function displayMemberInfo() {
    const userData = JSON.parse(localStorage.getItem("memberDetails"));

    if (userData) {
      document.getElementById("firstName").value = userData.firstName;
      document.getElementById("lastName").value = userData.lastName;
      document.getElementById("email").value = userData.email;
      document.getElementById("contactNo").value = userData.contactNo; // Assuming memberID as the username
      document.getElementById("currentProfilePicture").src = userData.profilePicture;
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
      contactNo:document.getElementById("contactNo").value,
      profilePicture: userData.profilePicture
    };

    try {
      const result = await updateMember(memberID, updatedData);
      if (result) {
        // Update localStorage with new data
        localStorage.setItem("memberDetails", JSON.stringify({ ...userData, ...updatedData }));
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
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedData)
      });

      if (!response.ok) {
        throw new Error(`Failed to update member. Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Member updated successfully:", result);
      return result; // Return result if needed for further processing
    } catch (error) {
      console.error("Error updating member:", error);
    }
  }
});
