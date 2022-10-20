const COORD_FORMATTER = Intl.NumberFormat('de-DE', { minimumFractionDigits: 6, maximumFractionDigits: 6, minimumIntegerDigits: 3, style: 'unit', unit: 'degree' });
const DIST_FORMATTER = Intl.NumberFormat('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1, style: 'unit', unit: 'meter' });
const DEG_FORMATTER = Intl.NumberFormat('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1, style: 'unit', unit: 'degree' });

const LOCATOR_ID = 'location';
const CAMERA_INPUT_ID = 'camera';

const locatorDiv = document.getElementById(LOCATOR_ID);
const cameraButton = document.getElementById(CAMERA_INPUT_ID);

//map state
var map;
var ranger;

function configureMap(latLngArray) {
    map = L.map('map').setView(latLngArray, 17);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    ranger = L.circle(latLngArray, { radius: 20.0 }).addTo(map);
}

let currentCoords = null;

function updatePosition(position) {
    const coords = position.coords;
    console.debug(`got new coordinates: ${coords}`);
    locatorDiv.innerHTML = `
        <dl>
            <dt>lat</dt>
            <dd>${COORD_FORMATTER.format(coords.latitude)}</dd>
            <dt>long</dt>
            <dd>${COORD_FORMATTER.format(coords.longitude)}</dd>
            <dt>alt</dt>
            <dd>${coords.altitude ? DIST_FORMATTER.format(coords.altitude) : '-'}</dd>
            <dt>accuracy</dt>
            <dd>${DIST_FORMATTER.format(coords.accuracy)}</dd>
            <dt>heading</dt>
            <dd>${coords.heading ? DEG_FORMATTER.format(coords.heading) : '-'}</dd>
            <dt>speed</dt>
            <dd>${coords.speed ? DIST_FORMATTER.format(coords.speed) : '-'}</dd>
        </dl>
    `;
    var ll = [coords.latitude, coords.longitude];

    map.setView(ll);

    ranger.setLatLng(ll);
    ranger.setRadius(coords.accuracy);
}

function logError(err) {
    console.error(err.message);
}

/* setup component */
configureMap([47.406653, 9.744844]);
