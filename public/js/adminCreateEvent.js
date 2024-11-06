document
  .getElementById("confirmCreateEvent")
  .addEventListener("click", async function () {
    const fileInput = document.getElementById("eventPicture");
    const file = fileInput.files[0];

    if (!file) {
      showCustomAlert("Please select an image to upload.");
      return;
    }

    try {
      const base64Image = await toBase64(file);

      const uploadResponse = await fetch("/api/event/uploadImage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          base64Image: base64Image,
          fileName: file.name,
        }),
      });

      if (!uploadResponse.ok) throw new Error("Failed to upload image");

      const uploadData = await uploadResponse.json();
      console.log(
        "Image uploaded successfully. File path:",
        uploadData.imageUrl
      );

      // Validation for Price (Integer)
      const priceString = document.getElementById("eventPrice").value;
      const parsedPrice = parseFloat(priceString.replace(/[^0-9.-]+/g, ""));
      if (isNaN(parsedPrice)) {
        showCustomAlert("Please enter a valid integer for the price.");
        return;
      }

      // Validation for Class Size (Integer)
      const classSize = document.getElementById("classSize").value;
      if (isNaN(parseInt(classSize))) {
        showCustomAlert("Please enter a valid integer for class size.");
        return;
      }

      const classSizeString = classSize + " days";

      // Validation for Duration (Number of Days)
      const duration = document.getElementById("duration").value;
      if (!/^\d+$/.test(duration) || parseInt(duration) <= 0) {
        showCustomAlert(
          "Please enter a valid duration in days (positive integer)."
        );
        return;
      }

      // Validation for Event Time
      const eventTime = document.getElementById("eventTime").value;
      if (!/^\d{1,2}([ap]m)-\d{1,2}([ap]m)$/.test(eventTime)) {
        showCustomAlert("Please enter a valid time format, e.g., 10am-6pm.");
        return;
      }

      function formatAndSortEventDates(eventDatesString) {
        if (typeof eventDatesString !== "string") {
          console.error("Invalid input: eventDatesString must be a string.");
          return "";
        }

        return eventDatesString
          .split(",")
          .map((date) => date.trim())
          .filter((date) => date) // Remove any empty strings in case of extra commas
          .sort((a, b) => new Date(a) - new Date(b))
          .join(",");
      }

      // Format Event Dates
      const eventDates = formatAndSortEventDates(
        document.getElementById("eventDates").value
      );

      const newEventData = {
        type: document.getElementById("eventType").value,
        title: document.getElementById("eventTitle").value,
        price: parsedPrice.toFixed(2),
        oldPrice: null,
        classSize: classSizeString,
        duration: duration,
        lunchProvided: true,
        lessonMaterialsProvided: true,
        accessToMembership: true,
        availableDates: eventDates,
        time: eventTime,
        totalParticipants: 0,
        venue: document.getElementById("eventVenue").value,
        picture: uploadData.imageUrl,
      };

      const createResponse = await fetch("/api/event/create-event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEventData),
      });

      if (createResponse.ok) {
        const createData = await createResponse.json();
        showCustomAlert(
          `Event successfully created and sent to Telegram Channel.`,
          "../adminHome.html"
        );
      } else {
        showCustomAlert("Failed to create event. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      showCustomAlert("An error occurred. Please try again.");
    }
  });

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  flatpickr("#eventDates", {
    mode: "multiple", // Allows selection of multiple dates
    dateFormat: "Y-m-d", // Format dates as yyyy-mm-dd
    minDate: "today", // Optional: restricts selection to future dates
    wrap: false,
  });
});

// Preview the image immediately upon file selection
document.getElementById("eventPicture").addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById("imagePlaceholder").src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

// Clear button functionality
document
  .getElementById("clearImageButton")
  .addEventListener("click", function () {
    // Reset the image placeholder to the default image
    document.getElementById("imagePlaceholder").src =
      "./img/misc/image-placeholder.jpg";

    // Clear the file input
    document.getElementById("eventPicture").value = "";
  });

const fileInput = document.getElementById("eventPicture");
const clearButton = document.getElementById("clearImageButton");

// Enable the clear button when a file is selected, disable it when cleared
fileInput.addEventListener("change", function () {
  if (fileInput.files.length > 0) {
    clearButton.classList.add("enabled");
  } else {
    clearButton.classList.remove("enabled");
  }
});

// Clear button functionality
clearButton.addEventListener("click", function () {
  if (clearButton.classList.contains("enabled")) {
    // Reset the image placeholder to the default image
    document.getElementById("imagePlaceholder").src =
      "./img/misc/image-placeholder.jpg";

    // Clear the file input
    fileInput.value = "";

    // Disable the clear button
    clearButton.classList.remove("enabled");
  }
});
