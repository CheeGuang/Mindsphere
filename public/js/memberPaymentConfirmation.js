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

    let newMembership = false; // Flag to determine if the membership is new

    async function redeemVoucher(redeemedVoucherID) {
      try {
        console.log(
          `[DEBUG] Redeeming voucher with redeemedVoucherID: ${redeemedVoucherID}`
        );
        const response = await fetch(
          `/api/voucher/redeem/${redeemedVoucherID}`,
          {
            method: "POST",
          }
        );

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            console.log(
              `[DEBUG] Voucher redeemed successfully: ${result.message}`
            );
            return result.voucherValue; // Return the voucher value if redemption is successful
          } else {
            console.error(
              `[DEBUG] Failed to redeem voucher: ${result.message}`
            );
            return 0; // Return 0 if voucher redemption failed
          }
        } else {
          console.error("[DEBUG] Redeem voucher request failed.");
          return 0; // Return 0 if request failed
        }
      } catch (error) {
        console.error("[DEBUG] Error redeeming voucher:", error);
        return 0; // Return 0 in case of an error
      }
    }

    async function enrollParticipants(enrollmentData) {
      const { memberID, eventID, participantsData, redeemedVoucherID } =
        enrollmentData;

      const redeemedVoucherDetails = sessionStorage.getItem(
        "redeemedVoucherDetails"
      );
      const redeemedVoucherValue = redeemedVoucherDetails
        ? JSON.parse(redeemedVoucherDetails).redeemedVoucherValue
        : 0;

      if (redeemedVoucherDetails) {
        sessionStorage.removeItem("redeemedVoucherDetails");
      }

      console.log(memberID, eventID, participantsData, redeemedVoucherValue);

      try {
        let orderNumber;

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

            // Redeem the voucher only if redeemedVoucherDetails exist
            if (redeemedVoucherDetails && redeemedVoucherID) {
              const formattedVoucherID = JSON.parse(redeemedVoucherID);
              const voucherValue = await redeemVoucher(formattedVoucherID);
              if (voucherValue > 0) {
                console.log(
                  `[DEBUG] Voucher redeemed successfully. Value: $${voucherValue.toFixed(
                    2
                  )}`
                );
              } else {
                console.error("[DEBUG] Voucher redemption failed.");
              }
            }

            await fetchAndStoreEventDetails(eventID);

            const eventDetails = JSON.parse(
              sessionStorage.getItem("selectedEventDetails")
            );
            const participantsData = JSON.parse(
              sessionStorage.getItem("participantsData")
            );

            const eventPrice = eventDetails.price * participantsData.length;
            const finalPrice = eventPrice - redeemedVoucherValue; // Deduct total voucher value
            $("#order-number").text(orderNumber);
            $("#total-amount").text(`$${finalPrice.toFixed(2)}`); // Update total amount
          } else {
            console.error(`[DEBUG] Error enrolling ${fullName}.`);
          }
        }
      } catch (error) {
        console.error("[DEBUG] Error during enrollment:", error);
      }
    }

    function formatExpiryDate(dateString) {
      const options = { year: "numeric", month: "long", day: "numeric" };
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, options);
    }

    if (typeof newMembership !== "undefined") {
      const membershipModalBody = $("#membershipModal .modal-body p");
      const membershipModalTitle = $("#membershipModalLabel");

      // Get the membership end date from localStorage or another source
      const memberDetails = JSON.parse(localStorage.getItem("memberDetails"));
      const membershipEndDate = memberDetails?.membershipEndDate;

      if (membershipEndDate) {
        const formattedExpiryDate = formatExpiryDate(membershipEndDate);

        if (newMembership === true) {
          // New membership
          membershipModalTitle.text("🎉 Welcome to Mind+!");
          membershipModalBody.html(
            "✨ <strong>Congratulations!</strong> ✨<br>" +
              "Welcome to <strong>Mind+</strong>! 🌟 You’re now part of an exclusive community with access to amazing benefits and features. 💼🎓<br>" +
              "Your membership is valid until <strong>" +
              formattedExpiryDate +
              "</strong>. 🗓️<br>" +
              "We’re thrilled to have you on board! 🚀"
          );
        } else {
          // Existing membership extended
          membershipModalTitle.text("💫 Membership Extended!");
          membershipModalBody.html(
            "🎉 Great news! Your <strong>Mind+</strong> membership has been extended! 📅<br>" +
              "Your new expiry date is <strong>" +
              formattedExpiryDate +
              "</strong>. 🗓️<br>" +
              "Enjoy another year of exclusive perks and benefits. 🌟"
          );
        }

        const recipientEmail = JSON.parse(
          localStorage.getItem("memberDetails")
        ).email;
        // Send email with membership info
        try {
          const response = await fetch(
            "api/emailService/send-membership-email",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ recipientEmail: recipientEmail }), // send user email
            }
          );

          if (response.ok) {
            console.log("Welcome email sent successfully!");
          } else {
            console.log("Failed to send welcome email.");
          }
        } catch (error) {
          console.error("Error sending email:", error);
        }
        // Show the modal
        $("#membershipModal").modal("show");
      }
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
    let totalVoucherValue = 0;
    const voucherValue = parseInt(urlParams.get("voucherValue"));

    if (voucherValue > 0) {
      totalVoucherValue += voucherValue;
    }

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
              `$${
                maxEvent.price.toFixed(2) * participantNo - totalVoucherValue
              }`
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
