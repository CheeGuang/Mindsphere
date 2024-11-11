const video = document.getElementById("video");

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("../../tensorflow_models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("../../tensorflow_models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("../../tensorflow_models"),
  faceapi.nets.faceExpressionNet.loadFromUri("../../tensorflow_models"),
]).then(startVideo);

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    (stream) => (video.srcObject = stream),
    (err) => console.error(err)
  );
}

video.addEventListener("play", () => {
  // Create canvas and appended it to the video container
  const container = document.querySelector(".video-container");
  const canvas = faceapi.createCanvasFromMedia(video);
  container.appendChild(canvas);

  // Set the canvas size to match the video dimensions
  const displaySize = { width: video.videoWidth, height: video.videoHeight };
  faceapi.matchDimensions(canvas, displaySize);

  // Run detection, draw on the canvas
  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();

    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
  }, 100);
});
