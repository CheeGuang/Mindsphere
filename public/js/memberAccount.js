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
  ["profilePicture", "username", "firstName", "lastName", "email"].forEach(
    (field) => {
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
        });

      // Cancel button handler
      document
        .getElementById("cancel" + capitalize(field))
        .addEventListener("click", function () {
          console.log(field + " edit cancelled");
          toggleEditMode(field);
        });
    }
  );

  document.getElementById("signOutBtn").addEventListener("click", function () {
    localStorage.removeItem("memberDetails");
    console.log("Signed out and memberDetails removed from local storage");

    showCustomAlert("Successfully Signed out.");

    // Wait for 3 seconds (3000 milliseconds) before redirecting
    setTimeout(function () {
      window.location.href = "../index.html";
    }, 3000);
  });
});
