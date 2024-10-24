$(document).ready(function () {
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

  // JavaScript code to handle dynamic participant forms
  let participantCount = 1;

  // Function to update the participant count display
  function updateParticipantCountDisplay() {
    $("#participantCount").text(participantCount);
  }

  // Function to add a new participant form
  function addParticipantForm() {
    participantCount++;
    const newForm = `
        <div class="card p-4 mb-5 shadow-sm participant-card border-light" data-participant="${participantCount}">
          <h5 class="mb-4 text-start">Participant ${participantCount}</h5>
          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label text-start w-100">Full Name</label>
              <input type="text" class="form-control" name="fullName${participantCount}" required />
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label text-start w-100">Age</label>
              <input type="text" class="form-control" name="age${participantCount}" required />
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-12">
              <label class="form-label text-start w-100">School Name</label>
              <input type="text" class="form-control" name="schoolName${participantCount}" required />
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
              <label class="form-label text-start w-100">Any existing medical conditions / things to note:</label>
              <textarea class="form-control" rows="4" name="medicalConditions${participantCount}"></textarea>
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label text-start w-100">Lunch option:</label>
              <div class="form-check mb-2">
                <input class="form-check-input" type="radio" name="lunchOption${participantCount}" id="nonVegan${participantCount}" value="nonVegan" />
                <label class="form-check-label text-start w-100" for="nonVegan${participantCount}">Non - Vegan</label>
              </div>
              <div class="form-check mb-2">
                <input class="form-check-input" type="radio" name="lunchOption${participantCount}" id="vegan${participantCount}" value="vegan" />
                <label class="form-check-label text-start w-100" for="vegan${participantCount}">Vegan</label>
              </div>
              <div class="form-check mb-2">
                <input class="form-check-input" type="radio" name="lunchOption${participantCount}" id="other${participantCount}" value="other" />
                <input type="text" class="form-control form-control-sm mt-2" id="otherInput${participantCount}" placeholder="Others" disabled />
              </div>
            </div>
          </div>
        </div>
      `;

    $("#participantFormsContainer").append(newForm);
    updateParticipantCountDisplay();
  }

  // Function to remove the last participant form
  function removeParticipantForm() {
    if (participantCount > 1) {
      $(
        `#participantFormsContainer .participant-card[data-participant="${participantCount}"]`
      ).remove();
      participantCount--;
      updateParticipantCountDisplay();
    }
  }

  // Event listeners for the + and - buttons
  $("#increaseParticipant").on("click", addParticipantForm);
  $("#decreaseParticipant").on("click", removeParticipantForm);

  // Event listener for the Next button
  $("#nextButton").on("click", function () {
    const participantsData = [];

    // Iterate through each participant form and collect data
    $("#participantFormsContainer .participant-card").each(function () {
      const participantIndex = $(this).data("participant");

      const participantData = {
        fullName: $(`input[name="fullName${participantIndex}"]`).val(),
        age: $(`input[name="age${participantIndex}"]`).val(),
        schoolName: $(`input[name="schoolName${participantIndex}"]`).val(),
        interests: $(`input[name="interests${participantIndex}"]`).val(),
        medicalConditions: $(
          `textarea[name="medicalConditions${participantIndex}"]`
        ).val(),
        lunchOption: $(
          `input[name="lunchOption${participantIndex}"]:checked`
        ).val(),
        specifyOther: $(`#otherInput${participantIndex}`).val(),
      };

      participantsData.push(participantData);
    });

    // Store the data in sessionStorage as JSON
    sessionStorage.setItem(
      "participantsData",
      JSON.stringify(participantsData)
    );

    // Optional: Show confirmation
    showCustomAlert("Participant data has been saved!");
  });
});
