function handleCredentialResponse(response) {
  // Log the credentials received
  console.log("Credential response received:", response.credential);
}

window.onload = function () {
  google.accounts.id.initialize({
    client_id:
      "1017023288717-hm48qb0numkukjvg5sehn13j0u9vspsm.apps.googleusercontent.com",
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
