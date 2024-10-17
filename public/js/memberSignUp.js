document.addEventListener("DOMContentLoaded", function () {
  const emailInput = document.getElementById("email");
  const confirmEmailBtn = document.getElementById("confirmEmailBtn");
  const resendLink = document.getElementById("resendLink");

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
});
