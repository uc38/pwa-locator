import saveImage from './save.svg';
import pauseImage from './pause-btn.svg';
import playImage from './play-btn.svg';
import cancelImage from './x-circle.svg';

let width = 320;    // We will scale the photo width to this
let height = 0;     // This will be computed based on the input stream
let streaming = false;  //flag for a 1st-time init
let isPaused = true;

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const photo = document.getElementById('photo');

const SAVE_INPUT_ID = 'save';
const PAUSE_INPUT_ID = 'pause';
const CANCEL_INPUT_ID = 'cancel';

const saveButton = document.getElementById(SAVE_INPUT_ID);
const pauseButton = document.getElementById(PAUSE_INPUT_ID);
const cancelButton = document.getElementById(CANCEL_INPUT_ID);

var latitude;
var longitude;

window.onload = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    latitude = urlParams.get("lat");
    longitude = urlParams.get("long");


    saveButton.src = saveImage;
    pauseButton.src = pauseImage;
    cancelButton.src = cancelImage;

    pauseButton.addEventListener("click", function() {
        togglePlayPause();
    });

    saveButton.addEventListener("click", function() {
        localStorage.setItem(`${latitude}x${longitude}`, canvas.toDataURL());
    });

    cancelButton.addEventListener("click", function () {
        location.href = "index.html";
    });
}

function addLocationToImage(context) {
     const text = "Latitude: " + latitude + ", Longitude: " + longitude;

    context.font = '16px Calibri';
    context.textAlign = 'center';
    context.textBaseline = 'bottom';

    const textMetrics = context.measureText(text);
    const backgroundMargin = 2;
    const backgroundWidth = textMetrics.width + 2 * backgroundMargin;

    const backgroundHeight = 20;
    context.fillStyle = 'rgba(255, 255, 255, 0.5)';

    context.fillRect((width - backgroundWidth) / 2, height - backgroundHeight, backgroundWidth, backgroundHeight);

    context.fillStyle = 'black';
    context.fillText(text, width / 2, height - backgroundMargin, width);

}

function togglePlayPause(){
    if (isPaused) {
        video.pause();
        pauseButton.src = playImage;
        isPaused = false;
        saveButton.disabled = false;
        takePicture();
        video.hidden = true;
        photo.hidden = false;
    } else {
        video.play();
        pauseButton.src = pauseImage;
        isPaused = true;
        saveButton.disabled = true;
        video.hidden = false;
        photo.hidden = true;
    }
}

//start video playback
navigator.mediaDevices.getUserMedia(
    { video: true, audio: false })
    .then((stream) => {
        video.srcObject = stream;
        video.play();
    })
    .catch((err) => {
        console.error(`An error occurred: ${err}`);
    });

function takePicture(event) {
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, width, height);

    addLocationToImage(context);

    let imageData = canvas.toDataURL('image/jpeg');
    photo.setAttribute('src', imageData);
}

function adjustAspectRations(event) {
    //perform a one-time adjustment of video's and photo's aspect ratio
    if (!streaming) {
        height = video.videoHeight / video.videoWidth * width;
        if (isNaN(height)) {
            height = width * 3.0 / 4.0;
        }

        video.setAttribute('width', width);
        video.setAttribute('height', height);
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        streaming = true;
    }
}

//further initializations as soon as a video stream appears
video.addEventListener('canplay', adjustAspectRations, false);