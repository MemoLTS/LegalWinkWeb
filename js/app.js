import { AsciiPlayer } from './vendor/asciline-player.js';

// Referencias al DOM
const container     = document.getElementById('player-container');
const statusEl      = document.getElementById('status');
const overlay       = document.getElementById('play-overlay');
const audioEl       = document.getElementById('ascii-audio');

const playPauseBtn  = document.getElementById('play-pause-btn');
const progressBar   = document.getElementById('progress-bar');
const volumeBar     = document.getElementById('volume-bar');
const timeDisplay   = document.getElementById('time-display');
const fullscreenBtn = document.getElementById('fullscreen-btn');

//  Helper de formato de tiempo (mm:ss)
function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

// Instancia del reproductor ASCII url: 'auto' hace que el SDK se conecte a ws://<mismo-host>/ws?codec=adaptive
// Esto asume que esta página se sirve desde el propio stream_server.py de ASCILINE.
const player = new AsciiPlayer('#ascii-canvas', {
    url: 'auto',
    audio: audioEl,
    container: '#player-container',
    selectionLayer: '#ascii-selection',
    autoplay: false,
});

let isSeeking = false;

// Eventos del reproductor
player.on('buffering', () => {
    statusEl.textContent = 'Conectando / almacenando en búfer…';
});

player.on('playing', () => {
    overlay.classList.add('hidden');
    playPauseBtn.textContent = '❚❚';
    statusEl.textContent = 'En vivo — reproduciendo';
});

player.on('paused', () => {
    playPauseBtn.textContent = '▶';
    statusEl.textContent = 'Pausado';
});

player.on('ended', () => {
    overlay.classList.remove('hidden');
    playPauseBtn.textContent = '▶';
    statusEl.textContent = 'Transmisión finalizada';
    progressBar.value = 0;
    timeDisplay.textContent = '00:00 / 00:00';
});

player.on('error', (msg) => {
    statusEl.textContent = msg || 'Error de conexión con el servidor ASCILINE';
    overlay.classList.remove('hidden');
    playPauseBtn.textContent = '▶';
});

// INIT: llega cuando el servidor confirma el video y su duración
player.on('init', (info) => {
    progressBar.max = info.duration || 0;
    progressBar.value = 0;
    timeDisplay.textContent = `00:00 / ${formatTime(info.duration || 0)}`;
});

// ── Bucle de actualización de la barra de progreso ──────────────
function tick() {
    if (!isSeeking && player.duration) {
        const current = player.getMasterClock();
        progressBar.value = Math.min(current, player.duration);
        timeDisplay.textContent = `${formatTime(current)} / ${formatTime(player.duration)}`;
    }
    requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

// ── Controles: Play / Pausa ──────────────────────────────────────
function togglePlay() {
    player.togglePlay();
}
playPauseBtn.addEventListener('click', togglePlay);
overlay.addEventListener('click', togglePlay);

// ── Controles: barra de progreso (seek) ──────────────────────────
progressBar.addEventListener('mousedown', () => { isSeeking = true; });
progressBar.addEventListener('touchstart', () => { isSeeking = true; });

progressBar.addEventListener('change', () => {
    player.seek(parseFloat(progressBar.value));
    isSeeking = false;
});

// ── Controles: volumen ────────────────────────────────────────────
volumeBar.addEventListener('input', (e) => {
    player.setVolume(parseFloat(e.target.value));
});

// ── Controles: pantalla completa ──────────────────────────────────
fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        container.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
});

// ── Atajos de teclado básicos ─────────────────────────────────────
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
    } else if (e.code === 'ArrowLeft') {
        player.skip(-10);
    } else if (e.code === 'ArrowRight') {
        player.skip(10);
    }
});
