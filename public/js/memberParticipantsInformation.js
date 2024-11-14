$(document).ready(async function () {
  // Load the customAlert.html into the container
  $("#customAlertContainer").load("./customAlert.html");

  // Define the showCustomAlert function globally
  window.showCustomAlert = function (message) {
    var $alert = $("#customAlert");
    $alert.text(message); // Update alert message
    $alert.fadeIn(); // Show the alert

    // Automatically hide after 5 seconds (5000ms)
    setTimeout(function () {
      $alert.fadeOut();
    }, 5000);
  };

  // Fetch children data from the API
  async function fetchChildrenData() {
    try {
      const memberID = JSON.parse(
        localStorage.getItem("memberDetails")
      ).memberID;
      const response = await fetch(`/api/child/${memberID}/`);
      if (!response.ok) {
        throw new Error("Failed to fetch participant data");
      }
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error("[ERROR] Fetching participants failed:", error.message);
      showCustomAlert("Failed to load participant data.");
      return [];
    }
  }

  // Populate child cards with editable forms
  async function initializeParticipants() {
    const children = await fetchChildrenData();

    if (children.length > 0) {
      children.forEach((child, index) => {
        const childCard = `
  <div class="card p-4 mb-5 shadow-sm participant-card border-light" data-participant="${
    index + 1
  }">
    <h5 class="mb-4 text-start">Child ${index + 1}</h5>
    <div class="row">
      <div class="col-md-6 mb-3">
        <label class="form-label text-start w-100">Full Name</label>
        <input type="text" class="form-control" name="fullName${
          index + 1
        }" value="${child.firstName} ${child.lastName}" required />
      </div>
      <div class="col-md-6 mb-3">
        <label class="form-label text-start w-100">Age</label>
        <input type="text" class="form-control" name="age${index + 1}" value="${
          child.age
        }" required />
      </div>
    </div>
    <div class="row mb-3">
      <div class="col-12">
        <label class="form-label text-start w-100">School Name</label>
        <input type="text" class="form-control" name="schoolName${
          index + 1
        }" value="${child.schoolName || ""}" required />
      </div>
    </div>
    <div class="row mb-3">
      <div class="col-12">
        <label class="form-label text-start w-100">Interests</label>
        <input type="text" class="form-control" name="interests${
          index + 1
        }" value="${child.interests || ""}" />
      </div>
    </div>
    <div class="row">
      <div class="col-md-6 mb-3">
        <label class="form-label text-start w-100">Any existing medical conditions / things to note:</label>
        <textarea class="form-control" rows="4" name="medicalConditions${
          index + 1
        }">${child.medicalConditions || ""}</textarea>
      </div>
      <div class="col-md-6 mb-3">
        <label class="form-label text-start w-100">Lunch option:</label>
        <div class="form-check mb-2">
          <input class="form-check-input" type="radio" name="lunchOption${
            index + 1
          }" id="nonVegan${index + 1}" value="nonVegan" ${
          child.lunchOption === "nonVegan" ? "checked" : ""
        } />
          <label class="form-check-label text-start w-100" for="nonVegan${
            index + 1
          }">Non - Vegan</label>
        </div>
        <div class="form-check mb-2">
          <input class="form-check-input" type="radio" name="lunchOption${
            index + 1
          }" id="vegan${index + 1}" value="vegan" ${
          child.lunchOption === "vegan" ? "checked" : ""
        } />
          <label class="form-check-label text-start w-100" for="vegan${
            index + 1
          }">Vegan</label>
        </div>
        <div class="form-check mb-2">
          <input class="form-check-input" type="radio" name="lunchOption${
            index + 1
          }" id="other${index + 1}" value="other" ${
          child.lunchOption === "other" ? "checked" : ""
        } />
          <input type="text" class="form-control form-control-sm mt-2" id="otherInput${
            index + 1
          }" placeholder="Others" value="${child.specifyOther || ""}" ${
          child.lunchOption === "other" ? "" : "disabled"
        } />
        </div>
      </div>
    </div>
    <div class="form-check mb-3">
      <input class="form-check-input" type="checkbox" name="registerChild" id="registerChild${
        index + 1
      }" value="${child.childID}" />
      <label class="form-check-label text-start w-100" for="registerChild${
        index + 1
      }">
        Register this child for the event
      </label>
    </div>
  </div>
`;
        $("#participantFormsContainer").append(childCard);
      });
    } else {
      $("#participantFormsContainer").append(
        `<p class="text-muted col-12 text-center">No children found for this member.</p>`
      );
    }
  }

  // Initialize participants
  await initializeParticipants();

  // Handle Submit Button Click
  $("#submitButton").on("click", function (e) {
    e.preventDefault(); // Prevent default anchor behavior

    const participantsData = [];
    let allLunchOptionsSelected = true;

    // Iterate through each participant form and collect data for selected participants
    $("#participantFormsContainer .participant-card").each(function () {
      const participantIndex = $(this).data("participant");
      const isSelected = $(`#registerChild${participantIndex}`).is(`:checked`);

      if (isSelected) {
        const lunchOption = $(
          `input[name="lunchOption${participantIndex}"]:checked`
        ).val();

        if (!lunchOption) {
          allLunchOptionsSelected = false;
        }

        const participantData = {
          fullName: $(`input[name="fullName${participantIndex}"]`).val(),
          age: $(`input[name="age${participantIndex}"]`).val(),
          schoolName: $(`input[name="schoolName${participantIndex}"]`).val(),
          interests: $(`input[name="interests${participantIndex}"]`).val(),
          medicalConditions: $(
            `textarea[name="medicalConditions${participantIndex}"]`
          ).val(),
          lunchOption: lunchOption,
          specifyOther: $(`#otherInput${participantIndex}`).val(),
        };

        participantsData.push(participantData);
      }
    });

    // Validation: Check if participants are selected
    if (participantsData.length === 0) {
      showCustomAlert("Please select at least one participant.");
      return;
    }

    // Validation: Check if all selected participants have lunch options
    if (!allLunchOptionsSelected) {
      showCustomAlert("Please select a lunch option for all participants.");
      return;
    }

    // Store the participants data in sessionStorage as JSON
    sessionStorage.setItem(
      "participantsData",
      JSON.stringify(participantsData)
    );

    // Prepare query string with encoded participants data
    const enrollmentData = {
      participantsData,
    };
    const encodedData = encodeURIComponent(JSON.stringify(enrollmentData));
    const paymentConfirmationLink = `memberPaymentDetails.html?data=${encodedData}`;

    // Optional: Show confirmation message before redirection
    showCustomAlert("Participants registered successfully!");

    setTimeout(() => {
      window.location.href = paymentConfirmationLink;
    }, 1000); // 1-second delay for confirmation
  });

  // Fetch vouchers from the API
  function fetchVouchers() {
    const memberID = JSON.parse(localStorage.getItem("memberDetails")).memberID;

    $.ajax({
      url: `api/voucher/${memberID}`,
      method: "GET",
      success: function (response) {
        if (response.success) {
          const vouchers = response.data;
          populateVouchers(vouchers);
        } else {
          console.error("Failed to fetch vouchers:", response.message);
        }
      },
      error: function (xhr, status, error) {
        console.error("Error fetching vouchers:", error);
      },
    });
  }

  // Populate vouchers dynamically
  function populateVouchers(vouchers) {
    const $vouchersContainer = $("#vouchersContainer");
    $vouchersContainer.empty();

    // Filter out vouchers with `redeemed === true`
    const availableVouchers = vouchers.filter((voucher) => !voucher.redeemed);

    if (availableVouchers.length === 0) {
      $vouchersContainer.append(
        '<p class="text-muted">No gift cards available to redeem.</p>'
      );
      return;
    }

    availableVouchers.forEach((voucher, index) => {
      const cardHTML = `
      <div class="col-sm-12 col-md-6 col-lg-4 d-flex justify-content-center">
        <div class="card border-0" style="border-radius: 20px; overflow: hidden; width: 100%; max-width: 400px; height: 250px;">
          <div class="card-body text-center p-4" style="background: linear-gradient(135deg, #3c4ad1, #7a91e2); color: #fff; padding: 30px;">
            <h5 class="card-title" style="font-size: 2rem; font-weight: bold; margin-bottom: 15px;">Gift Card</h5>
            <p class="text-muted" style="color: rgba(255, 255, 255, 0.8) !important; font-size: 1.2rem;">
              $${voucher.value} Value, Minimum Spend: $${
        voucher.minimumSpend
      }<br />
              Expire: ${new Date(voucher.expiryDate).toLocaleDateString()}<br />
            </p>
            <button 
              class="btn btn-light mt-4 redeem-button" 
              data-id="${voucher.voucherID}" data-value="${voucher.value}" 
              style="color: #3c4ad1; font-weight: bold; border-radius: 30px; padding: 12px 25px;">
              Redeem
            </button>
          </div>
        </div>
      </div>
    `;
      $vouchersContainer.append(cardHTML);
    });

    $(".redeem-button").on("click", function () {
      const $selectedButton = $(".redeem-button.btn-success"); // Check if a button is already selected

      if ($selectedButton.length > 0 && !$(this).hasClass("btn-success")) {
        // If a button is already selected and the current button is not the selected one
        showCustomAlert("You can only select one gift card per transaction.");
        return;
      }

      if ($(this).hasClass("btn-success")) {
        // If currently selected, unselect it
        $(this)
          .removeClass("btn-success")
          .addClass("btn-light")
          .css("color", "#3c4ad1")
          .text("Redeem");
      } else {
        // If currently unselected, select it
        $(this)
          .removeClass("btn-light")
          .addClass("btn-success")
          .css("color", "#fff")
          .text("Selected");
      }
    });

    async function populateParticipantSelection() {
      const participants = await fetchChildrenData(); // Fetch the participant data

      const $participantSelectionContainer = $(
        "#participantSelectionContainer"
      );
      $participantSelectionContainer.empty(); // Clear previous options if any

      if (participants.length > 0) {
        participants.forEach((participant, index) => {
          const optionHTML = `
            <div class="form-check mb-3">
              <input
                class="form-check-input"
                type="radio"
                name="selectedParticipant"
                id="participant${index + 1}"
                value="${participant.id}" 
                required
              />
              <label class="form-check-label" for="participant${index + 1}">
                ${participant.firstName} ${participant.lastName}, Age: ${
            participant.age
          }
              </label>
            </div>
          `;
          $participantSelectionContainer.append(optionHTML);
        });
      } else {
        $participantSelectionContainer.append(
          `<p class="text-muted text-center">No participants found to select from.</p>`
        );
      }
    }

    // Call the function to populate participant options
    populateParticipantSelection();

    $("#submitButton").on("click", function () {
      const selectedChildren = $("input[name='registerChild']:checked")
        .map(function () {
          return $(this).val(); // Retrieve the value of the checked checkbox (child ID)
        })
        .get();

      console.log("Selected Children:", selectedChildren); // Debug: Check selected children

      // Validate at least one child is selected
      if (selectedChildren.length === 0) {
        showCustomAlert("Please select at least one child to register.");
        console.log("No children selected."); // Debug: No children selected
        return; // Stop execution if no child is selected
      }

      let allLunchOptionsValid = true;

      // Validate lunch option for each selected child
      selectedChildren.forEach((childID) => {
        const childCard = $(
          `#participantFormsContainer .participant-card[data-participant="${childID}"]`
        );
        const lunchOption = childCard
          .find(`input[name="lunchOption${childID}"]:checked`)
          .val();

        console.log(`Child ${childID} lunch option:`, lunchOption); // Debug: Check lunch option

        if (!lunchOption) {
          showCustomAlert(`Please select a lunch option for Child ${childID}.`);
          allLunchOptionsValid = false;
        }
      });

      if (!allLunchOptionsValid) {
        console.log("Lunch option validation failed."); // Debug: Failed validation
        return; // Stop further execution if validation fails
      }

      const participantsData = [];

      // Collect data for each selected child
      selectedChildren.forEach((childID) => {
        const childCard = $(
          `#participantFormsContainer .participant-card[data-participant="${childID}"]`
        );

        const participantData = {
          fullName: childCard.find(`input[name="fullName${childID}"]`).val(),
          age: childCard.find(`input[name="age${childID}"]`).val(),
          schoolName: childCard
            .find(`input[name="schoolName${childID}"]`)
            .val(),
          interests: childCard.find(`input[name="interests${childID}"]`).val(),
          medicalConditions: childCard
            .find(`textarea[name="medicalConditions${childID}"]`)
            .val(),
          lunchOption: childCard
            .find(`input[name="lunchOption${childID}"]:checked`)
            .val(),
          specifyOther: childCard.find(`#otherInput${childID}`).val(),
        };

        console.log(`Participant Data for Child ${childID}:`, participantData); // Debug: Check participant data

        participantsData.push(participantData);
      });

      // Get the ID of the redeemed voucher
      const redeemedVoucherButton = $(".redeem-button.btn-success");
      const redeemedVoucherID =
        redeemedVoucherButton.length > 0
          ? redeemedVoucherButton.data("id")
          : null;

      const redeemedVoucherValue =
        redeemedVoucherButton.length > 0
          ? redeemedVoucherButton.data("value")
          : null;

      const redeemedVoucherDetails = {
        redeemedVoucherID: redeemedVoucherID,
        redeemedVoucherValue: redeemedVoucherValue,
      };

      console.log("Redeemed Voucher Details:", redeemedVoucherDetails); // Debug: Check redeemed voucher details

      // Store the data in sessionStorage as JSON
      sessionStorage.setItem(
        "redeemedVoucherDetails",
        JSON.stringify(redeemedVoucherDetails)
      );

      // Prepare query string with encoded participants data
      const enrollmentData = {
        participantsData,
        redeemedVoucherDetails,
      };

      const encodedData = encodeURIComponent(JSON.stringify(enrollmentData));

      console.log("Encoded Enrollment Data:", encodedData); // Debug: Check encoded enrollment data

      // Update the href to include the encoded data
      const paymentConfirmationLink = `memberPaymentDetails.html?data=${encodedData}`;
      $("#submitButton").attr("href", paymentConfirmationLink);

      // Optional: Show confirmation and proceed only if validation is successful
      if (participantsData.length > 0) {
        showCustomAlert("Participant data and voucher selection saved!");
        console.log("Participant data and voucher saved."); // Debug: Confirmation message
      } else {
        showCustomAlert("Please select at least one participant.");
        console.log("No participants selected."); // Debug: No participants selected
      }

      console.log("Stored Data:", enrollmentData); // Debug: Final enrollment data
    });
  }

  // Fetch vouchers on page load
  fetchVouchers();
});
