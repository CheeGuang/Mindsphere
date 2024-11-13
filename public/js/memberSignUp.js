document.addEventListener("DOMContentLoaded", function () {
  const emailInput = document.getElementById("email");
  const emailVCInput = document.getElementById("emailVC");
  const confirmEmailBtn = document.getElementById("confirmEmailBtn");
  const resendLink = document.getElementById("resendLink");
  const signUpForm = document.getElementById("signUpForm");

  // Disable the resend link initially
  resendLink.style.pointerEvents = "none";
  resendLink.style.opacity = "0.5";

  // Function to send verification email
  async function sendVerificationEmail() {
    const email = emailInput.value;

    if (!email) {
      showCustomAlert("Please enter a valid email");
      return;
    }

    try {
      const response = await fetch("/api/member/send-verification-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Failed to send verification email");
      }

      const result = await response.json();
      showCustomAlert(result.message || "Verification email sent!");
    } catch (error) {
      console.error("Error:", error.message);
      showCustomAlert("Error sending verification email.");
    }
  }

  // Countdown function for the resend link
  function startResendCountdown() {
    let countdown = 15;
    resendLink.textContent = `Resend Verification Code (${countdown}s)`;

    const intervalId = setInterval(function () {
      countdown--;
      resendLink.textContent = `Resend Verification Code (${countdown}s)`;

      if (countdown === 0) {
        clearInterval(intervalId);
        resendLink.textContent = "Resend Verification Code";
        resendLink.style.pointerEvents = "auto";
        resendLink.style.opacity = "1";
      }
    }, 1000); // Update every second
  }

  // Function to verify the verification code
  async function verifyVerificationCode() {
    const email = emailInput.value;
    const verificationCode = emailVCInput.value;

    if (!verificationCode || !email) {
      showCustomAlert("Please enter a valid verification code and email");
      return false;
    }

    try {
      const response = await fetch("/api/member/verify-verification-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, verificationCode }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        showCustomAlert("Invalid verification code. Please try again.");
        return false;
      }

      return true; // Verification successful
    } catch (error) {
      console.error("Error:", error.message);
      showCustomAlert("Error verifying the verification code.");
      return false;
    }
  }

  // Function to create a new member
  async function createMember() {
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value; // Fixed variable name
    const contactNo = document.getElementById("contactNo").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const referralCode = document.getElementById("referralCode").value;

    if (password !== confirmPassword) {
      showCustomAlert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("/api/member/create-member", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          contactNo,
          password,
          referralCode,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        if (result.newMemberID) {
          console.log(result);
          // Store the newly created member ID in session storage
          sessionStorage.setItem("newMemberID", result.newMemberID);

          // Show success alert with the new member ID
          showCustomAlert(
            `Member created successfully. New Member ID: ${result.newMemberID}`
          );
        } else {
          // Handle the case where the member was updated
          showCustomAlert("Member updated successfully.");
        }
      } else {
        // Show error message
        showCustomAlert(result.message || "Error creating member.");
      }
    } catch (error) {
      console.error("Error:", error.message);
      showCustomAlert("Error creating member.");
    }
  }

  // Attach event listener to the Next button
  document
    .getElementById("nextStepBtn")
    .addEventListener("click", async function () {
      // Prevent default form submission behavior
      event.preventDefault();

      // First, verify the verification code
      const isVerified = await verifyVerificationCode();

      if (isVerified) {
        // If the verification code is valid, create the member
        createMember();
        setTimeout(() => {
          window.location.href = "memberSignUpChildren.html";
        }, 3000); // 3-second delay
      } else {
        // Handle invalid verification code (optional)
        showCustomAlert("Invalid verification code. Please try again.");
      }
    });

  // Confirm button click event
  confirmEmailBtn.addEventListener("click", function () {
    sendVerificationEmail();

    // Disable the resend link and start countdown
    resendLink.style.pointerEvents = "none";
    resendLink.style.opacity = "0.5";
    startResendCountdown();
  });

  // Resend verification link click event
  resendLink.addEventListener("click", function (event) {
    event.preventDefault();
    sendVerificationEmail();
    // Start a new countdown after the resend
    resendLink.style.pointerEvents = "none";
    resendLink.style.opacity = "0.5";
    startResendCountdown();
  });

  const childFormsContainer = document.getElementById("childFormsContainer");
  const childCountDisplay = document.getElementById("childCount");
  const increaseChildButton = document.getElementById("increaseChild");
  const decreaseChildButton = document.getElementById("decreaseChild");
  const nextStepButton = document.getElementById("nextStepButton");

  let childCount = 1;

  // Function to create a new child form
  function createChildForm(index) {
    const childForm = document.createElement("div");
    childForm.classList.add(
      "card",
      "p-4",
      "mb-4",
      "shadow-sm",
      "child-card",
      "border-light"
    );
    childForm.dataset.child = index;

    childForm.innerHTML = `
      <h5 class="mb-4 text-start">Child ${index}</h5>
      <div class="row mb-3">
        <div class="col-md-6">
          <label class="form-label">First Name</label>
          <input type="text" class="form-control" name="firstName${index}" required />
        </div>
        <div class="col-md-6">
          <label class="form-label">Last Name</label>
          <input type="text" class="form-control" name="lastName${index}" required />
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-md-6">
          <label class="form-label">Age</label>
          <input type="number" class="form-control" name="age${index}" required min="1" max="100" />
        </div>
        <div class="col-md-6">
          <label class="form-label">School Name</label>
          <input type="text" class="form-control" name="schoolName${index}" required />
        </div>
      </div>
      <div class="mb-3">
        <label class="form-label">Medical Conditions</label>
        <textarea class="form-control" name="medicalConditions${index}" placeholder="Enter medical conditions, if any"></textarea>
      </div>
      <div class="mb-3">
        <label class="form-label">Dietary Preferences</label>
        <input type="text" class="form-control" name="dietaryPreferences${index}" placeholder="Enter dietary preferences" />
      </div>
      <div class="mb-3">
        <label class="form-label">Interests</label>
        <input type="text" class="form-control" name="interests${index}" placeholder="Enter interests" />
      </div>
    `;

    return childForm;
  }

  // Update child count display
  function updateChildCountDisplay() {
    childCountDisplay.textContent = childCount;
  }

  // Increase child forms
  increaseChildButton.addEventListener("click", function () {
    childCount++;
    updateChildCountDisplay();
    childFormsContainer.appendChild(createChildForm(childCount));
  });

  // Decrease child forms
  decreaseChildButton.addEventListener("click", function () {
    if (childCount > 1) {
      childFormsContainer.lastElementChild.remove();
      childCount--;
      updateChildCountDisplay();
    }
  });

  // Validate all forms before proceeding
  function validateForms() {
    let formIsValid = true;

    document.querySelectorAll(".child-card").forEach((childForm) => {
      childForm.querySelectorAll("input, textarea").forEach((input) => {
        if (!input.checkValidity()) {
          formIsValid = false;
          input.classList.add("is-invalid");
        } else {
          input.classList.remove("is-invalid");
        }
      });
    });

    return formIsValid;
  }

  // Event listener for Next button
  nextStepButton.addEventListener("click", function (event) {
    event.preventDefault();

    if (validateForms()) {
      showCustomAlert("Form is valid. Proceeding to the next page.");
      window.location.href = "./nextPage.html"; // Replace with the actual next page URL
    } else {
      showCustomAlert("Please complete all fields correctly.");
    }
  });

  // Initialize with one child form
  updateChildCountDisplay();
});
