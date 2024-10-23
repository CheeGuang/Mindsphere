// Get the radio buttons and the textbox
const otherRadio = document.getElementById("other1");
const specifyInput = document.getElementById("specifyInput");

// Get the other radio buttons
const nonVeganRadio = document.getElementById("nonVegan1");
const veganRadio = document.getElementById("vegan1");

// Add event listeners to the radio buttons
otherRadio.addEventListener("change", function () {
  if (this.checked) {
    specifyInput.disabled = false;
    specifyInput.required = true;
  }
});

nonVeganRadio.addEventListener("change", function () {
  specifyInput.disabled = true;
  specifyInput.required = false;
  specifyInput.value = ""; // Clear the value if switching away from "Others"
});

veganRadio.addEventListener("change", function () {
  specifyInput.disabled = true;
  specifyInput.required = false;
  specifyInput.value = ""; // Clear the value if switching away from "Others"
});
