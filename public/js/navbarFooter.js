// Determine the current page's name
const pageName = window.location.pathname.split("/").pop();

// Function to update the profile picture in the navbar
const updateProfilePicture = (profilePicture) => {
  const profilePictureContainer = document.querySelector(
    ".profile-picture-container"
  ); // Target the profile picture container

  if (profilePicture && profilePictureContainer) {
    // Create an img element to replace the placeholder
    const imgElement = document.createElement("img");
    imgElement.src = profilePicture;
    imgElement.alt = "Profile Picture";
    imgElement.style.width = "40px"; // Adjust the size of the profile picture
    imgElement.style.height = "40px";
    imgElement.style.borderRadius = "50%"; // Make the profile picture round

    // Replace the placeholder with the new img element
    profilePictureContainer.innerHTML = ""; // Clear any existing content
    profilePictureContainer.appendChild(imgElement);
  }
};

// Fetch and insert the appropriate navbar HTML based on conditions
let navbarFile;

// Check if adminDetails or memberDetails exist in localStorage
const adminDetails = JSON.parse(localStorage.getItem("adminDetails"));
const memberDetails = JSON.parse(localStorage.getItem("memberDetails"));
const adminID = adminDetails?.adminID;
const memberID = memberDetails?.memberID;

if (adminID) {
  // Load admin-specific navbar
  navbarFile = "adminNavbar.html";

  // Call the API to get the admin's profile picture
  fetch(`/api/admin/get-admin-profile-picture`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ adminID: adminID }), // Ensure adminID is correctly included in the body
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
      console.error("Error fetching admin profile picture:", error)
    );
} else if (memberID) {
  // Fetch member-specific navbar and profile picture
  navbarFile = "memberNavbar.html";

  // Call the API to get the member's profile picture
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
  // Default to general navbar if neither adminDetails nor memberDetails are found
  navbarFile = "navbar.html";
}

// Fetch the navbar HTML and insert it into the page
fetch(navbarFile)
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("navbar-container").innerHTML = data;

    // After inserting navbar, check if profile picture should be updated
    const storedProfilePicture = localStorage.getItem("profilePicture");
    if (storedProfilePicture) {
      updateProfilePicture(storedProfilePicture);
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
