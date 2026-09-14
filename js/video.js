const videoPlayer = document.getElementById("video-player");
const videoTitle = document.getElementById("video-title");
const statusElement = document.getElementById("status");
const previousButton = document.getElementById("previous-video");
const nextButton = document.getElementById("next-video");
const positionElement = document.getElementById("video-position");
const fullscreenButton = document.getElementById("fullscreen-btn");
const totalVideos = 44;
const selectedVideo = Number(new URLSearchParams(window.location.search).get("contenido")) || 1;
let currentVideo = Math.min(Math.max(selectedVideo, 1), totalVideos);

function videoSource(numero) {
    return `assets/video/video-${String(numero).padStart(2, "0")}.mp4`;
}

function updateNavigation() {
    previousButton.disabled = currentVideo === 1;
    nextButton.disabled = currentVideo === totalVideos;
    positionElement.textContent = `${currentVideo} / ${totalVideos}`;
}

function loadVideo(numero) {
    currentVideo = Math.min(Math.max(numero, 1), totalVideos);
    videoTitle.textContent = `Contenido ${String(currentVideo).padStart(2, "0")}`;
    statusElement.textContent = "Preparando video...";
    videoPlayer.src = videoSource(currentVideo);
    videoPlayer.load();
    updateNavigation();
    window.history.replaceState({}, "", `video.html?contenido=${currentVideo}`);
}

videoPlayer.addEventListener("loadedmetadata", () => {
    statusElement.textContent = "Listo para reproducir";
});

videoPlayer.addEventListener("error", () => {
    statusElement.textContent = "Agrega el archivo de video para este contenido";
});

previousButton.addEventListener("click", () => {
    if (currentVideo > 1) {
        loadVideo(currentVideo - 1);
    }
});

nextButton.addEventListener("click", () => {
    if (currentVideo < totalVideos) {
        loadVideo(currentVideo + 1);
    }
});

fullscreenButton.addEventListener("click", async () => {
    if (!document.fullscreenElement) {
        await videoPlayer.requestFullscreen();
    } else {
        await document.exitFullscreen();
    }
});

loadVideo(currentVideo);
