document.addEventListener("DOMContentLoaded", function () {
  const emailInput = document.getElementById("email");
  const emailVCInput = document.getElementById("emailVC");
  const confirmEmailBtn = document.getElementById("confirmEmailBtn");
  const resendLink = document.getElementById("resendLink");
  const forgotPasswordForm = document.getElementById("forgotPasswordForm");
  let isVerified = false; // Variable to track if verification is successful

  // Disable the resend link initially
  resendLink.style.pointerEvents = "none";
  resendLink.style.opacity = "0.5";

  // Function to send verification code
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

      isVerified = true; // Set verification as successful
      showCustomAlert(
        "Verification successful. You can now reset your password."
      );
      return true;
    } catch (error) {
      console.error("Error:", error.message);
      showCustomAlert("Error verifying the verification code.");
      return false;
    }
  }

  // Function to reset the password
  async function resetPassword() {
    if (!isVerified) {
      showCustomAlert(
        "Please verify your email before resetting your password."
      );
      return;
    }

    const email = emailInput.value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
      showCustomAlert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("/api/member/update-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          newPassword: password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        showCustomAlert("Password reset successfully");
        // Optionally, redirect to login page after a few seconds
        setTimeout(() => {
          window.location.href = "memberLogIn.html";
        }, 3000); // 3-second delay
      } else {
        showCustomAlert(result.message || "Error resetting password.");
      }
    } catch (error) {
      console.error("Error:", error.message);
      showCustomAlert("Error resetting password.");
    }
  }

  // Confirm button click event to send verification email
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

  // Form submit event to reset password after verification
  forgotPasswordForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    // Verify the code before allowing password reset
    const verified = await verifyVerificationCode();
    if (verified) {
      resetPassword(); // Reset password if verification is successful
    }
  });
});
