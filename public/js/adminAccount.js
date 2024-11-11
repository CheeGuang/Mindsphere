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
  ["contactNo", "firstName", "lastName", "email", "bio"].forEach((field) => {
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
      });
  });

  document.getElementById("signOutBtn").addEventListener("click", function () {
    localStorage.removeItem("adminDetails");
    console.log("Signed out and adminDetails removed from local storage");

    showCustomAlert("Successfully Signed out.");

    // Wait for 3 seconds (1000 milliseconds) before redirecting
    setTimeout(function () {
      window.location.href = "../index.html";
    }, 1000);
  });
  displayAdminInfo();

  function displayAdminInfo() {
    const admindata = JSON.parse(localStorage.getItem("adminDetails"));
    console.log(admindata);
    if (admindata) {
      document.getElementById("bio").value = admindata.bio;
      document.getElementById("firstName").value = admindata.firstName;
      document.getElementById("lastName").value = admindata.lastName;
      document.getElementById("email").value = admindata.email;
      document.getElementById("contactNo").value = admindata.contactNo;
      document.getElementById("currentProfilePicture").src = JSON.parse(
        localStorage.getItem("adminDetails")
      ).profilePicture;
    }
  }
  const btn = document.getElementById("q");
  btn.addEventListener("click", function () {
    setTimeout(function () {
      window.location.href = "../adminScheduleAvailability.html";
    }, 1000);
  });
  async function saveMemberChanges() {
    const adminData = JSON.parse(localStorage.getItem("adminDetails"));
    if (!adminData) return;

    const adminID = adminData.adminID;
    const updatedData = {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      email: document.getElementById("email").value,
      contactNo: document.getElementById("contactNo").value,
      profilePicture: adminData.profilePicture,
      bio: document.getElementById("bio").value,
    };

    try {
      const result = await updateAdmin(adminID, updatedData);
      if (result && !result.error) {
        // Update localStorage with new data
        localStorage.setItem(
          "adminDetails",
          JSON.stringify({ ...adminData, ...updatedData })
        );
        console.log("Local storage updated with new admin details.");
        showCustomAlert("Admin details updated successfully.");
      } else {
        console.error("Failed to update admin:", result.error);
      }
    } catch (error) {
      console.error("Failed to save admin changes:", error);
    }
  }

  async function updateAdmin(adminID, updatedData) {
    try {
      const response = await fetch(`/api/admin/update-admin/${adminID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      console.log(result.message);
      return result;
    } catch (error) {
      console.error("Failed to update admin:", error);
      return { error: error.message };
    }
  }
});
