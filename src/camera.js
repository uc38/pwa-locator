const VIDEO_ID = 'video';
const VIDEO_DIV_ID = 'video-container';
const SHOOT_ID = 'play-pause';
const SAVE_ID = 'save';
const CANCEL_ID = 'cancel';
const CANVAS_ID = 'canvas';
const PHOTO_IMG_ID = 'photo';
const PHOTO_DIV_ID = 'img-container';

const VIDEO_MODE_CLASS = 'video-mode';
const PHOTO_MODE_CLASS = 'photo-mode';

let width = 320;    // We will scale the photo width to this
let height = 0;     // This will be computed based on the input stream

let streaming = false;  //flag to do a 1st-time init

//page elements
let video = null;
let videoContainer = null;
let canvas = null;
let photoImg = null;
let photoImgContainer = null;
let pausePlayButton = null;
let saveButton = null;
const cancelButton = document.getElementById(CANCEL_ID);

let imageData = null;   //data of last captured photo

function clearPhoto() {
    const context = canvas.getContext('2d');
    context.fillStyle = "#222";
    context.fillRect(0, 0, canvas.width, canvas.height);

    const data = canvas.toDataURL('image/png');
    photoImg.setAttribute('src', data);
}

function takePicture(event) {
    const context = canvas.getContext('2d');
    if (width && height) {
        canvas.width = width;
        canvas.height = height;
        context.drawImage(video, 0, 0, width, height);

        imageData = canvas.toDataURL('image/png');
        photo.setAttribute('src', imageData);

        //switch to image display
        document.body.className = PHOTO_MODE_CLASS;
        saveButton.disabled = false;

        pausePlayButton.onclick = cancelPicture;
    } else {
        clearPhoto();
    }
    event.preventDefault();
}

function backToLocator() {
    const url = `/index.html${window.location.search}`;
    console.debug(`navigate to ${url}`);
    imageData = null;
    window.location.href = url;
}

function saveAndExit(event) {
    console.debug('saveAndExit');
    const queryParams = new URLSearchParams(window.location.search);
    localStorage.setItem(`${queryParams.get('lng')}x${queryParams.get('lat')}`, imageData);
    backToLocator();
}

function cancelPicture(event) {
    imageData = null;

    //switch to image display
    document.body.className = VIDEO_MODE_CLASS;
    saveButton.disabled = true;

    pausePlayButton.onclick = takePicture;
}

function startup() {
    video = document.getElementById(VIDEO_ID);
    canvas = document.getElementById(CANVAS_ID);
    photoImg = document.getElementById(PHOTO_IMG_ID);
    pausePlayButton = document.getElementById(SHOOT_ID);
    saveButton = document.getElementById(SAVE_ID);

    //start video playback
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then((stream) => {
            video.srcObject = stream;
            video.play();
        })
        .catch((err) => {
            console.error(`An error occurred: ${err}`);
        });

    //further initializations as soon as a video stream appears
    video.addEventListener('canplay', (ev) => {
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
        pausePlayButton.onclick = takePicture;
        saveButton.onclick = saveAndExit;
    }, false);

    clearPhoto();
}

cancelButton.onclick = (e) => backToLocator();
window.addEventListener('load', startup, false);