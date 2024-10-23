// Determine the current page's name
const pageName = window.location.pathname.split("/").pop();

// Function to update the profile picture in the navbar
const updateProfilePicture = (profilePicture) => {
  const profileIcon = document.querySelector("#profile-picture-icon"); // Make sure the profile icon element exists
  if (profilePicture && profileIcon) {
    // If a profile picture exists, replace the Font Awesome icon with the image
    profileIcon.src = profilePicture;
    profileIcon.classList.remove("fas", "fa-user-circle"); // Remove the Font Awesome classes
  }
};

// Fetch and insert the appropriate navbar HTML based on conditions
let navbarFile;

// Check if memberID exists in localStorage
const memberID = localStorage.getItem("memberID");

if (memberID) {
  // Fetch member-specific navbar and profile picture
  navbarFile = "memberNavbar.html";

  // Call the API to get the profile picture
  fetch(`/api/member/get-member-profile-picture`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ memberID: memberID }), // Ensure memberID is correctly included in the body
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success && data.profilePicture) {
        updateProfilePicture(data.profilePicture);
        // Store the profile picture in localStorage for reuse
        localStorage.setItem("profilePicture", data.profilePicture);
      }
    })
    .catch((error) =>
      console.error("Error fetching member profile picture:", error)
    );
} else {
  // Default to general navbar if no memberID is found
  navbarFile = "navbar.html";
}

// Fetch the navbar HTML and insert it into the page
fetch(navbarFile)
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("navbar-container").innerHTML = data;

    // After inserting navbar, check if memberID exists and profile picture should be updated
    if (memberID) {
      const profileIconElement = document.querySelector(
        "#profile-picture-icon"
      );
      if (profileIconElement) {
        // If profile picture exists in localStorage, update it in the navbar
        const storedProfilePicture = localStorage.getItem("profilePicture");
        if (storedProfilePicture) {
          updateProfilePicture(storedProfilePicture);
        }
      }
    }
  })
  .catch((error) => console.error("Error loading navbar:", error));

// Fetch and insert the footer HTML using JavaScript
fetch("footer.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("footer").innerHTML = data;
  })
  .catch((error) => console.error("Error loading footer:", error));
