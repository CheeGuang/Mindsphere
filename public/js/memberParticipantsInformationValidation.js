document.addEventListener("DOMContentLoaded", function () {
  // Selecting elements
  const participantFormContainer = document.getElementById("participantFormsContainer");
  const participantCountDisplay = document.getElementById("participantCount");
  const increaseParticipantButton = document.getElementById("increaseParticipant");
  const decreaseParticipantButton = document.getElementById("decreaseParticipant");
  const nextButton = document.getElementById("nextButton");
  let participantCount = 1;

  // Function to create a new participant form
  function createParticipantForm(index) {
    const participantForm = document.createElement("div");
    participantForm.classList.add("card", "p-4", "mb-4", "shadow-sm", "participant-card", "border-light");
    participantForm.dataset.participant = index;

    participantForm.innerHTML = `
      <h5 class="mb-4 text-start">Participant ${index}</h5>
      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="form-label text-start w-100">Full Name</label>
          <input type="text" class="form-control" name="fullName${index}" placeholder="Enter full name" required
            pattern="[A-Za-z\\s]{2,50}" title="Name should be 2-50 alphabetic characters" />
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label text-start w-100">Age</label>
          <input type="number" class="form-control" name="age${index}" placeholder="Enter age" required min="1" max="100"
            title="Age must be between 1 and 100" />
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-12">
          <label class="form-label text-start w-100">School Name</label>
          <input type="text" class="form-control" name="schoolName${index}" placeholder="Enter school name" required
            pattern="[A-Za-z\\s]{2,100}" title="School name should be 2-100 alphabetic characters" />
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-12">
          <label class="form-label text-start w-100">Interests</label>
          <select class="form-control" name="interests${index}" required>
            <option value="" disabled selected>Select an interest</option>
            <option value="Travel">Travel</option>
            <option value="Technology">Technology</option>
            <option value="Art">Art</option>
            <option value="Sports">Sports</option>
            <option value="Nature">Nature</option>
            <option value="Cooking">Cooking</option>
          </select>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="form-label text-start w-100">Any existing medical conditions / things to note:</label>
          <textarea class="form-control" rows="4" name="medicalConditions${index}"
            placeholder="Please enter any medical conditions or notes. If none, type 'None'."></textarea>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label text-start w-100">Lunch option:</label>
          <div class="form-check mb-2">
            <input class="form-check-input" type="radio" name="lunchOption${index}" id="nonVegan${index}" value="nonVegan" checked />
            <label class="form-check-label text-start w-100" for="nonVegan${index}">Non - Vegan</label>
          </div>
          <div class="form-check mb-2">
            <input class="form-check-input" type="radio" name="lunchOption${index}" id="vegan${index}" value="vegan" />
            <label class="form-check-label text-start w-100" for="vegan${index}">Vegan</label>
          </div>
          <div class="form-check mb-2">
            <input class="form-check-input other-option" type="radio" name="lunchOption${index}" id="other${index}" value="other" />
            <label class="form-check-label text-start w-100" for="other${index}">Other</label>
            <input type="text" class="form-control form-control-sm mt-2 other-input" id="otherInput${index}"
              placeholder="Specify other option" disabled name="otherLunchOption${index}" />
          </div>
        </div>
      </div>
    `;
    
    // Add event listener for lunch options toggle
    const otherOption = participantForm.querySelector(`#other${index}`);
    const otherInput = participantForm.querySelector(`#otherInput${index}`);
    participantForm.querySelectorAll(`input[name="lunchOption${index}"]`).forEach((option) => {
      option.addEventListener("change", function () {
        if (otherOption.checked) {
          otherInput.disabled = false;
        } else {
          otherInput.disabled = true;
          otherInput.value = ""; // Clear input if it's disabled
        }
      });
    });

    return participantForm;
  }

  // Update participant count display
  function updateParticipantCountDisplay() {
    participantCountDisplay.textContent = participantCount;
  }

  // Increase participants
  increaseParticipantButton.addEventListener("click", function () {
    participantCount++;
    updateParticipantCountDisplay();
    participantFormContainer.appendChild(createParticipantForm(participantCount));
  });

  // Decrease participants
  decreaseParticipantButton.addEventListener("click", function () {
    if (participantCount > 1) {
      participantFormContainer.lastElementChild.remove();
      participantCount--;
      updateParticipantCountDisplay();
    }
  });

  // Only add the initial participant form when the page loads
  updateParticipantCountDisplay();
   if (participantCount > 1) {
    participantFormContainer.appendChild(createParticipantForm(participantCount));
  }

  // Validate all participant forms before proceeding to the next page
  function validateForms() {
    let formIsValid = true;

    // Loop through all participant forms and validate each
    document.querySelectorAll('.participant-card').forEach((participantForm) => {
      participantForm.querySelectorAll("input, select, textarea").forEach((input) => {
        if (!input.checkValidity()) {
          formIsValid = false;
          input.classList.add("is-invalid");
        } else {
          input.classList.remove("is-invalid");
        }
      });
    });

    return formIsValid;
  }

  // Event listener for Next button
  nextButton.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default navigation

    // Run validation
    if (validateForms()) {
      alert("Form is valid. Proceeding to the next page.");
      // Navigate to the next page if the form is valid
      window.location.href = "./memberPaymentDetails.html";
    } else {
      alert("Please fill out all required fields correctly before proceeding.");
    }
  });

 const otherLunchOption = document.getElementById("other1");
  const otherInput = document.getElementById("otherInput1");

  // Get all lunch option radio buttons
  const lunchOptions = document.querySelectorAll("input[name='lunchOption1']");

  // Toggle the 'Other' input field based on radio button selection
  lunchOptions.forEach((option) => {
    option.addEventListener("change", function () {
      if (otherLunchOption.checked) {
        otherInput.disabled = false;
      } else {
        otherInput.disabled = true;
        otherInput.value = ""; // Clear input if it's disabled
      }
    });
  });


});
