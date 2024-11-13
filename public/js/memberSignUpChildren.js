$(document).ready(function () {
  let participantCount = 1;

  // Function to update the participant count display
  function updateParticipantCountDisplay() {
    console.log("Updating participant count display to:", participantCount);
    $("#participantCount").text(participantCount);
  }

  // Function to add a new participant form with required fields
  function addParticipantForm() {
    participantCount++;
    console.log(
      "Adding participant form. Current participant count:",
      participantCount
    );
    const newForm = `
      <div class="card p-4 mb-4 shadow-sm participant-card border-light" data-participant="${participantCount}">
        <h5 class="mb-4 text-start">Child ${participantCount}</h5>
        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-label text-start w-100">First Name</label>
            <input type="text" class="form-control" name="firstName${participantCount}" required />
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label text-start w-100">Last Name</label>
            <input type="text" class="form-control" name="lastName${participantCount}" required />
          </div>
        </div>
        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-label text-start w-100">Age</label>
            <input type="number" class="form-control" name="age${participantCount}" required />
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label text-start w-100">Relationship</label>
            <input type="text" class="form-control" name="relationship${participantCount}" required />
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-12">
            <label class="form-label text-start w-100">School Name</label>
            <input type="text" class="form-control" name="schoolName${participantCount}" />
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-12">
            <label class="form-label text-start w-100">Interests</label>
            <input type="text" class="form-control" name="interests${participantCount}" />
          </div>
        </div>
        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-label text-start w-100">Medical Conditions</label>
            <textarea class="form-control" rows="4" name="medicalConditions${participantCount}"></textarea>
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label text-start w-100">Dietary Preferences</label>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="dietaryPreference${participantCount}" id="nonVegan${participantCount}" value="Non-Vegan" />
              <label class="form-check-label" for="nonVegan${participantCount}">Non-Vegan</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="dietaryPreference${participantCount}" id="vegan${participantCount}" value="Vegan" />
              <label class="form-check-label" for="vegan${participantCount}">Vegan</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="dietaryPreference${participantCount}" id="other${participantCount}" value="Other" />
              <label class="form-check-label" for="other${participantCount}">Other</label>
            </div>
            <input type="text" class="form-control form-control-sm mt-2" id="otherInput${participantCount}" placeholder="Specify other preferences" disabled />
          </div>
        </div>
      </div>`;
    $("#participantFormsContainer").append(newForm);
    updateParticipantCountDisplay();
  }

  // Event listener for enabling/disabling "Other" text input
  $(document).on(
    "change",
    "input[type='radio'][name^='dietaryPreference']",
    function () {
      const participantIndex = $(this)
        .attr("name")
        .replace("dietaryPreference", "");
      const otherInput = $(`#otherInput${participantIndex}`);
      console.log(
        "Dietary preference changed for participant",
        participantIndex,
        "to",
        $(this).val()
      );
      if ($(this).val() === "Other") {
        otherInput.prop("disabled", false).focus();
      } else {
        otherInput.prop("disabled", true).val("");
      }
    }
  );

  // Event listener for the Register button
  $("#registerButton").on("click", function () {
    console.log("Register button clicked.");

    // Validate checkboxes
    const isInfoAccuracyChecked = $("#infoAccuracyCheckbox").is(":checked");
    const isTermsConditionsChecked = $("#termsConditionsCheckbox").is(
      ":checked"
    );

    if (!isInfoAccuracyChecked || !isTermsConditionsChecked) {
      showCustomAlert(
        "Please confirm that the information provided is accurate and agree to the terms and conditions before proceeding."
      );
      console.error("Checkbox validation failed.");
      return; // Stop further processing
    }

    const newMemberID = sessionStorage.getItem("newMemberID");
    if (!newMemberID) {
      showCustomAlert("Member ID is missing. Please log in again.");
      console.error("Member ID is missing in session storage.");
      return;
    }

    const childrenData = [];

    // Collect data from each participant form
    $("#participantFormsContainer .participant-card").each(function () {
      const participantIndex = $(this).data("participant");

      const selectedDietaryPreference = $(
        `input[name="dietaryPreference${participantIndex}"]:checked`
      ).val();

      const dietaryPreference =
        selectedDietaryPreference === "Other"
          ? $(`#otherInput${participantIndex}`).val()
          : selectedDietaryPreference;

      const childData = {
        memberID: newMemberID,
        firstName: $(`input[name="firstName${participantIndex}"]`).val(),
        lastName: $(`input[name="lastName${participantIndex}"]`).val(),
        age: $(`input[name="age${participantIndex}"]`).val(),
        relationship: $(`input[name="relationship${participantIndex}"]`).val(),
        schoolName: $(`input[name="schoolName${participantIndex}"]`).val(),
        interests: $(`input[name="interests${participantIndex}"]`).val(),
        medicalConditions: $(
          `textarea[name="medicalConditions${participantIndex}"]`
        ).val(),
        dietaryPreferences: dietaryPreference,
      };

      console.log("Collected child data:", childData);
      childrenData.push(childData);
    });

    // Send data to the backend API
    console.log("Sending children data to backend:", childrenData);
    $.ajax({
      url: "/api/child/register-child",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(childrenData),
      success: function (response) {
        console.log("Backend response:", response);
        showCustomAlert("Children registered successfully!");
        sessionStorage.setItem("registeredChildren", JSON.stringify(response));
        setTimeout(() => {
          window.location.href = "memberLogin.html";
        }, 3000); // 3-second delay
      },
      error: function (xhr) {
        console.error(
          "Failed to register children:",
          xhr.responseJSON?.message || "Unknown error"
        );
        showCustomAlert(
          `Failed to register children: ${
            xhr.responseJSON?.message || "Unknown error"
          }`
        );
      },
    });
  });

  // Event listener for + and - buttons
  $("#increaseParticipant").on("click", addParticipantForm);
  $("#decreaseParticipant").on("click", function () {
    if (participantCount > 1) {
      console.log(
        "Removing participant form. Current participant count:",
        participantCount
      );
      $(
        `#participantFormsContainer .participant-card[data-participant="${participantCount}"]`
      ).remove();
      participantCount--;
      updateParticipantCountDisplay();
    }
  });
});
