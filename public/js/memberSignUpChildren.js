document.addEventListener("DOMContentLoaded", function () {
  const childFormsContainer = document.getElementById("childFormsContainer");
  const childCountDisplay = document.getElementById("childCount");
  const increaseChildButton = document.getElementById("increaseChild");
  const decreaseChildButton = document.getElementById("decreaseChild");
  const nextStepButton = document.getElementById("nextStepButton");

  let childCount = 1;

  // Function to create a new child form
  function createChildForm(index) {
    const childForm = document.createElement("div");
    childForm.classList.add(
      "card",
      "p-4",
      "mb-4",
      "shadow-sm",
      "child-card",
      "border-light"
    );
    childForm.dataset.child = index;

    childForm.innerHTML = `
      <h5 class="mb-4 text-start">Child ${index}</h5>
      <div class="row mb-3">
        <div class="col-md-6">
          <label class="form-label">First Name</label>
          <input type="text" class="form-control" name="firstName${index}" required />
        </div>
        <div class="col-md-6">
          <label class="form-label">Last Name</label>
          <input type="text" class="form-control" name="lastName${index}" required />
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-md-6">
          <label class="form-label">Age</label>
          <input type="number" class="form-control" name="age${index}" required min="1" max="100" />
        </div>
        <div class="col-md-6">
          <label class="form-label">School Name</label>
          <input type="text" class="form-control" name="schoolName${index}" required />
        </div>
      </div>
      <div class="mb-3">
        <label class="form-label">Medical Conditions</label>
        <textarea class="form-control" name="medicalConditions${index}" placeholder="Enter medical conditions, if any"></textarea>
      </div>
      <div class="mb-3">
        <label class="form-label">Dietary Preferences</label>
        <input type="text" class="form-control" name="dietaryPreferences${index}" placeholder="Enter dietary preferences" />
      </div>
      <div class="mb-3">
        <label class="form-label">Interests</label>
        <input type="text" class="form-control" name="interests${index}" placeholder="Enter interests" />
      </div>
    `;

    return childForm;
  }

  // Update child count display
  function updateChildCountDisplay() {
    childCountDisplay.textContent = childCount;
  }

  // Increase child forms
  increaseChildButton.addEventListener("click", function () {
    childCount++;
    updateChildCountDisplay();
    childFormsContainer.appendChild(createChildForm(childCount));
  });

  // Decrease child forms
  decreaseChildButton.addEventListener("click", function () {
    if (childCount > 1) {
      childFormsContainer.lastElementChild.remove();
      childCount--;
      updateChildCountDisplay();
    }
  });

  // Validate all forms before proceeding
  function validateForms() {
    let formIsValid = true;

    document.querySelectorAll(".child-card").forEach((childForm) => {
      childForm.querySelectorAll("input, textarea").forEach((input) => {
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
  nextStepButton.addEventListener("click", function (event) {
    event.preventDefault();

    if (validateForms()) {
      alert("Form is valid. Proceeding to the next page.");
      window.location.href = "./nextPage.html"; // Replace with the actual next page URL
    } else {
      alert("Please complete all fields correctly.");
    }
  });

  // Initialize with one child form
  updateChildCountDisplay();
  childFormsContainer.appendChild(createChildForm(1));
});
