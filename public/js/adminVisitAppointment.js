// memberVisitAppointment.js

document.addEventListener("DOMContentLoaded", () => {
    const participantURL = localStorage.getItem("ParticipantURL");
  
    if (!participantURL) {
      console.error("Participant URL not found in localStorage.");
      return;
    }
  
    const meetingFrame = document.getElementById("meeting-frame");
    meetingFrame.src = participantURL;
  
    console.log("Set iframe src to:", participantURL);
  });
  