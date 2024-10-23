function handleCredentialResponse(response) {
  // Log the credentials received
  console.log("Credential response received:", response.credential);

  // Split the JWT token to get the payload
  const tokenParts = response.credential.split(".");
  const base64Url = tokenParts[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  // Parse the JSON payload to get the user information
  const userInfo = JSON.parse(jsonPayload);

  // Display the decoded user information
  console.log("Decoded user info:", userInfo);

  const { email, given_name, family_name, picture } = userInfo;

  // Step 1: Check if both email and contact exist in the database
  fetch("/api/member/check-email-and-contact-exists", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: email }), // Send the email to check both email and contact
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.emailExists && data.contactExists) {
        // Step 2: If both email and contact exist, store memberID in local storage and redirect to memberHome.html
        localStorage.setItem("memberID", data.memberID);
        window.location.href = "memberHome.html";
      } else if (data.emailExists && !data.contactExists) {
        localStorage.setItem("memberID", data.memberID);
        window.location.href = "memberGoogleSignUp.html";
      } else {
        // Step 5: If both email and contact are missing, create a new Google member
        fetch("/api/member/create-google-member", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: given_name,
            lastName: family_name,
            email: email,
            profilePicture: picture,
          }),
        })
          .then((response) => response.json())
          .then((createData) => {
            // Step 6: Once created, store the memberID in local storage and redirect to googleSignUp.html
            localStorage.setItem("memberID", createData.memberID);
            window.location.href = "memberGoogleSignUp.html";
          })
          .catch((error) => {
            console.error("Error creating Google member:", error);
          });
      }
    })
    .catch((error) => {
      console.error("Error checking email and contact:", error);
    });
}

window.onload = function () {
  google.accounts.id.initialize({
    client_id:
      "669052276058-vlo56v1ae21jida2o982ams3rgfimajd.apps.googleusercontent.com",
    callback: handleCredentialResponse,
    ux_mode: "popup",
    auto_prompt: false,
  });

  google.accounts.id.renderButton(document.querySelector(".g_id_signin"), {
    theme: "outline",
    size: "large",
    text: "continue_with",
    logo_alignment: "left",
  });

  google.accounts.id.prompt(); // Display the One Tap dialog if applicable
};

document.addEventListener("DOMContentLoaded", function () {
  // Handle form submission for login
  document.querySelector("form").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form from submitting traditionally

    // Get email and password from the form fields
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Make the API call to login the member
    fetch("/api/member/login-member", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }), // Send email and password in the body
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // If login is successful, store the memberID in localStorage
          localStorage.setItem("memberID", data.memberID);
          window.location.href = "memberHome.html"; // Redirect to memberHome.html
        } else {
          // Show an error message if login failed
          showCustomAlert(data.message);
        }
      })
      .catch((error) => {
        console.error("Error logging in:", error);
        showCustomAlert("An error occurred. Please try again.");
      });
  });
});

// Handle guest login
document.getElementById("guestButton").addEventListener("click", function () {
  // Set the memberID in localStorage for guest user
  localStorage.setItem("memberID", 1);

  // Redirect to memberHome.html
  window.location.href = "./memberHome.html";
});
