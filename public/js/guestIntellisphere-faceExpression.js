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
