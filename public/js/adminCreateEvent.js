document.getElementById("confirmCreateEvent").addEventListener("click", async function() {
    const fileInput = document.getElementById("eventPicture");
    const file = fileInput.files[0];
    
    if (!file) {
      showCustomAlert("Please select an image to upload.");
      return;
    }
  
    const formData = new FormData();
    formData.append("image", file);
  
    try {
      // Step 1: Upload the image and get the file path
      const uploadResponse = await fetch("/api/event/uploadImage", {
        method: "POST",
        body: formData,
      });
  
      if (!uploadResponse.ok) throw new Error("Failed to upload image");
  
      const uploadData = await uploadResponse.json();
      console.log("Image uploaded successfully. File path:", uploadData.filePath);

      // Step 2: Gather event data with the uploaded image path
      const priceString = document.getElementById("eventPrice").value;
      const parsedPrice = parseFloat(priceString.replace(/[^0-9.-]+/g, "")).toFixed(2);

      const newEventData = {
        type: document.getElementById("eventType").value,
        title: document.getElementById("eventTitle").value,
        price: parsedPrice,
        oldPrice: null, // Optional: adjust as needed
        classSize: document.getElementById("classSize").value,
        duration: document.getElementById("duration").value,
        lunchProvided: true, // Default or set based on form input
        lessonMaterialsProvided: true, // Default or set based on form input
        accessToMembership: true, // Default or set based on form input
        availableDates: document.getElementById("eventDates").value,
        time: document.getElementById("eventTime").value,
        totalParticipants: 0, // Default if you do not have this field in the form
        venue: document.getElementById("eventVenue").value,
        picture: uploadData.filePath, // Set picture to the uploaded image's path
      };

      // Step 3: Send the event creation request
      const createResponse = await fetch("/api/event/create-event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEventData),
      });

      if (createResponse.ok) {
        const createData = await createResponse.json();
        showCustomAlert(`Event successfully created and sent to Telegram Channel.`);
      } else {
        showCustomAlert("Failed to create event. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      showCustomAlert("An error occurred. Please try again.");
    }
  });
