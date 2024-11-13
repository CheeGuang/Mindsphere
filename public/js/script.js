document.addEventListener("DOMContentLoaded", () => {
  if (window.location.origin.includes("member")) {
    fetch("../contactUsButton.html")
      .then((response) => response.text())
      .then((html) => {
        document.getElementById("contactUsButton").innerHTML = html;
      })
      .catch((error) => console.error("Error loading contactUsButton:", error));
  }
});
