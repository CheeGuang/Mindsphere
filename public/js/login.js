function handleCredentialResponse(response) {
  // Log the credentials received
  console.log("Credential response received:", response.credential);
}

window.onload = function () {
  google.accounts.id.initialize({
    client_id:
      "669052276058-tengiui547lt5fg3grjm35odb3d1k78s.apps.googleusercontent.com",
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
