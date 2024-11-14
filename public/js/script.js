document.addEventListener("DOMContentLoaded", () => {
  // Check if memberDetails exists in localStorage
  const memberDetails = localStorage.getItem("memberDetails");

  // If memberDetails exists, proceed to load and display the contact button
  if (memberDetails) {
    fetch("../contactUsButton.html")
      .then((response) => response.text())
      .then((html) => {
        document.getElementById("contactUsButton").innerHTML = html;
      })
      .catch((error) => console.error("Error loading contactUsButton:", error));
  }
});
