
function togglePasswordVisibility(inputId) {
    const inputField = document.getElementById(inputId);
    const icon = inputField.nextElementSibling.querySelector('i');
  
    if (inputField.type === "password") {
      inputField.type = "text";
      icon.classList.replace("fa-eye-slash", "fa-eye");
    } else {
      inputField.type = "password";
      icon.classList.replace("fa-eye", "fa-eye-slash");
    }
}
  
async function updatePassword(email, newPassword) {
    try {
        const response = await fetch('/api/member/update-password', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, newPassword })
        });

        const data = await response.json();

        if (response.ok) {
            console.log(data.message);
        } else {
            console.error("Failed to update password:", data.message);
        }
    } catch (error) {
        console.error("Error:", error);
    }

    
}

  // Add event listeners for toggle buttons
  document.addEventListener("DOMContentLoaded", function () {
    const newPasswordToggle = document.querySelector("#newPassword + button");
      const confirmPasswordToggle = document.querySelector("#confirmPassword + button");
      const btnchangepassword = document.querySelector('.btn-warning')
  
    if (newPasswordToggle) {
      newPasswordToggle.addEventListener("click", () => togglePasswordVisibility("newPassword"));
    }
    if (confirmPasswordToggle) {
      confirmPasswordToggle.addEventListener("click", () => togglePasswordVisibility("confirmPassword"));
      }
      
      // Function to show the toast
     const passwordMismatchModal = new bootstrap.Modal(document.getElementById('passwordMismatchModal'));
     if (btnchangepassword) {
        btnchangepassword.addEventListener("click", function () {
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const memberData = JSON.parse(localStorage.getItem("memberDetails"));
            const email = memberData ? memberData.email : null;

            if (!email) {
                console.error("Email not found in local storage.");
                return;
            }

            if (newPassword === confirmPassword) {
                updatePassword(email, newPassword);
            } else {
                passwordMismatchModal.show();
                //alert("Passwords do not match. Please try again.");
            }
        });
    }
  });