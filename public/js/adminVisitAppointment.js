document.addEventListener("DOMContentLoaded", () => {
  // Retrieve HostRoomURL from localStorage
  const hostRoomURL = localStorage.getItem("HostRoomURL");

  if (hostRoomURL) {
    // Set the src of the Whereby iframe to HostRoomURL
    const iframe = document.getElementById("meeting-frame");
    iframe.src = hostRoomURL;
    console.log("Set iframe src to HostRoomURL:", hostRoomURL);
  } else {
    console.error("No HostRoomURL found in localStorage.");
  }
});
