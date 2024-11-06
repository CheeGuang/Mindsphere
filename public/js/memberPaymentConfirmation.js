$(document).ready(async function () {
  // Function to fetch event details by ID and store in sessionStorage
  async function fetchAndStoreEventDetails(eventId) {
    try {
      const response = await fetch(`/api/event/get-event-by-id/${eventId}`);
      if (response.ok) {
        const eventDetails = await response.json();
        sessionStorage.setItem(
          "selectedEventDetails",
          JSON.stringify(eventDetails)
        );
      } else {
        console.error("Failed to fetch event details.");
      }
    } catch (error) {
      console.error("Error fetching event details:", error);
    }
  }

  // Load the customAlert.html into the container
  console.log("[DEBUG] Loading customAlert.html into #customAlertContainer");
  $("#customAlertContainer").load("./customAlert.html");

  // Define the showCustomAlert function globally
  window.showCustomAlert = function (message) {
    console.log(`[DEBUG] Showing custom alert with message: ${message}`);
    var $alert = $("#customAlert");
    $alert.text(message);
    $alert.fadeIn();
    setTimeout(function () {
      $alert.fadeOut();
    }, 5000);
  };

  const urlParams = new URLSearchParams(window.location.search);
  let enrollmentData = null;

  // Check if `data` parameter contains `participantsData`
  const hasParticipantData = JSON.parse(
    decodeURIComponent(urlParams.get("data"))
  ).participantsData;

  if (hasParticipantData) {
    console.log("[DEBUG] Query parameters detected with data.");
    try {
      enrollmentData = JSON.parse(decodeURIComponent(urlParams.get("data")));
      if (enrollmentData && enrollmentData.participantsData) {
        console.log(
          "[DEBUG] Enrollment data contains participantsData:",
          enrollmentData
        );
        sessionStorage.setItem(
          "participantsData",
          JSON.stringify(enrollmentData.participantsData)
        );
      } else {
        console.error("[DEBUG] participantsData is missing in URL parameter.");
        return;
      }
    } catch (error) {
      console.error("[DEBUG] Error parsing enrollment data:", error);
      return;
    }

    const memberEventID = sessionStorage.getItem("memberEventID");
    const selectedEventDetails = sessionStorage.getItem("selectedEventDetails");
    const participantsData = sessionStorage.getItem("participantsData");

    if (memberEventID && selectedEventDetails && participantsData) {
      console.log("[DEBUG] Enrollment data found in sessionStorage.");
      const eventDetails = JSON.parse(selectedEventDetails);
      const totalPrice =
        eventDetails.price * JSON.parse(participantsData).length;

      $("#order-number").text(memberEventID);
      $("#total-amount").text(`$${totalPrice.toFixed(2)}`);
    } else {
      console.error("[DEBUG] No enrollment data found in sessionStorage.");
    }

    let membershipUpdated = false;

    // Proceed with enrollment if enrollment data is available
    if (enrollmentData && enrollmentData.participantsData) {
      const { memberID, eventID, participantsData } = enrollmentData;
      console.log(memberID);
      console.log(eventID);
      console.log(participantsData);

      try {
        var orderNumber;

        for (let participant of participantsData) {
          const fullName =
            participant.fullName ||
            `${participant.firstName} ${participant.lastName}`;
          if (!fullName) {
            console.error(
              "[DEBUG] FullName is missing for participant:",
              participant
            );
            continue;
          }

          console.log({
            memberID: memberID,
            eventID: eventID,
            fullName: fullName,
            age: participant.age,
            schoolName: participant.schoolName,
            interests: participant.interests,
            medicalConditions: participant.medicalConditions,
            lunchOption: participant.lunchOption,
            specifyOther: participant.specifyOther,
          });
          const response = await $.ajax({
            url: `${window.location.origin}/api/event/enroll-member-to-event`,
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
              memberID: memberID,
              eventID: eventID,
              fullName: fullName,
              age: participant.age,
              schoolName: participant.schoolName,
              interests: participant.interests,
              medicalConditions: participant.medicalConditions,
              lunchOption: participant.lunchOption,
              specifyOther: participant.specifyOther,
            }),
          });

          console.log("[DEBUG] Enrollment response:", response);

          if (response.success && response.memberEventID) {
            console.log(
              `[DEBUG] ${fullName} enrolled successfully. MemberEventID: ${response.memberEventID}`
            );
            sessionStorage.setItem("memberEventID", response.memberEventID);

            if (!orderNumber) {
              orderNumber = response.memberEventID;
            }

            // Check if membership was updated
            if (response.membershipUpdated) {
              membershipUpdated = true; // Set flag if membership was updated
            }

            await fetchAndStoreEventDetails(eventID);

            const eventDetails = JSON.parse(
              sessionStorage.getItem("selectedEventDetails")
            );
            const participantsData = JSON.parse(
              sessionStorage.getItem("participantsData")
            );

            const recipientEmail = JSON.parse(
              localStorage.getItem("memberDetails")
            ).email;
            if (
              response.memberEventID &&
              participantsData &&
              eventDetails &&
              recipientEmail &&
              !sessionStorage.getItem("invoiceSent")
            ) {
              try {
                console.log("[DEBUG] Sending invoice email...");
                await $.ajax({
                  url: `${window.location.origin}/api/event/send-invoice-email`,
                  method: "POST",
                  contentType: "application/json",
                  data: JSON.stringify({
                    eventID: eventDetails.eventID,
                    participantsData: participantsData,
                    memberEventID: response.memberEventID,
                    recipientEmail: recipientEmail,
                    memberDetails: { memberID, email: recipientEmail },
                  }),
                  success: function () {
                    console.log("[DEBUG] Invoice sent successfully!");
                    sessionStorage.setItem("invoiceSent", "true");
                  },
                  error: function (error) {
                    console.error("[DEBUG] Error sending invoice:", error);
                  },
                });
              } catch (error) {
                console.error(
                  "[DEBUG] Error triggering invoice generation:",
                  error
                );
              }
            }
          } else {
            console.error(`[DEBUG] Error enrolling ${fullName}.`);
          }
        }

        $("#order-number").text(orderNumber);
        $("#total-amount").text(
          `$${(
            JSON.parse(sessionStorage.getItem("selectedEventDetails")).price *
            length(JSON.parse(sessionStorage.getItem("participantData")))
          ).toFixed(2)}`
        );
      } catch (error) {
        console.error("[DEBUG] Error during enrollment:", error);
      }
    }

    // After the for loop, show modal if membership was updated
    if (membershipUpdated) {
      $("#membershipModal").modal("show"); // Show the modal
    }

    function fetchMemberDetails(memberID) {
      fetch(`/api/member/member-details/${memberID}`)
        .then((response) => response.json())
        .then((memberDetails) => {
          // Store member details as a JSON object in localStorage
          const memberDetailsJson = {
            memberID: memberDetails.data.memberID,
            firstName: memberDetails.data.firstName,
            lastName: memberDetails.data.lastName,
            email: memberDetails.data.email,
            contactNo: memberDetails.data.contactNo,
            profilePicture: memberDetails.data.profilePicture,
            membershipEndDate: memberDetails.data.membershipEndDate,
          };
          localStorage.setItem(
            "memberDetails",
            JSON.stringify(memberDetailsJson)
          );
        })
        .catch((error) => {
          console.error("Error fetching member details:", error);
        });
    }

    fetchMemberDetails(memberID);

    sessionStorage.removeItem("invoiceSent");
    $("#continue-shopping-btn").click(function () {
      console.log(
        "[DEBUG] Continue shopping button clicked. Redirecting to homepage."
      );
      window.location.href = "../memberHome.html";
    });
  } else {
    console.log(
      "[DEBUG] No participant data in URL. Retrieving data from sessionStorage."
    );

    // Retrieve `memberID` from `sessionStorage`
    const memberID = sessionStorage.getItem("memberID");

    // Extract `participantNo` from the query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const participantNo = parseInt(urlParams.get("participantNo"));

    if (!memberID) {
      console.error("[DEBUG] Member ID or email not found in sessionStorage.");
      return;
    }

    // Wait for 2 seconds before executing the fetch
    setTimeout(async () => {
      try {
        // Fetch events for the member
        const response = await fetch(
          `/api/event/get-event-by-member-id/${memberID}`
        );
        if (response.ok) {
          const events = await response.json();

          console.log(events);
          // Assuming events is an array, find the maximum memberEventID and price
          if (events.length > 0) {
            const maxEvent = events.reduce((max, event) => {
              return event.memberEventID > max.memberEventID ? event : max;
            });

            console.log(maxEvent);

            $("#order-number").text(maxEvent.memberEventID);
            $("#total-amount").text(
              `$${maxEvent.price.toFixed(2) * participantNo}`
            );
          } else {
            console.error("[DEBUG] No events found for this member.");
          }
        } else {
          console.error("[DEBUG] Failed to fetch events for member.");
        }
      } catch (error) {
        console.error("[DEBUG] Error fetching events for member:", error);
      }
    }, 2000); // Delay of 2000 milliseconds (2 seconds)

    $("#continue-shopping-btn").click(function () {
      console.log(
        "[DEBUG] Continue shopping button clicked. Redirecting to homepage."
      );
      window.location.href = "../index.html";
    });
    return;
  }
});
