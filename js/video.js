const playerContainer = document.getElementById("player-container");
const videoTitle = document.getElementById("video-title");
const statusElement = document.getElementById("status");
const previousButton = document.getElementById("previous-video");
const nextButton = document.getElementById("next-video");
const positionElement = document.getElementById("video-position");
const fullscreenButton = document.getElementById("fullscreen-btn");
const totalVideos = 44;
const selectedVideo = Number(new URLSearchParams(window.location.search).get("contenido")) || 1;
let currentVideo = Math.min(Math.max(selectedVideo, 1), totalVideos);

let player = null;

function ascfSource(numero) {
    return `assets/videos/video-${String(numero).padStart(2, "0")}.ascf`;
}

function audioSource(numero) {
    return `assets/videos/video-${String(numero).padStart(2, "0")}.mp3`;
}

function updateNavigation() {
    previousButton.disabled = currentVideo === 1;
    nextButton.disabled = currentVideo === totalVideos;
    positionElement.textContent = `${currentVideo} / ${totalVideos}`;
}

async function audioExists(url) {
    try {
        const res = await fetch(url, { method: "HEAD" });
        return res.ok;
    } catch {
        return false;
    }
}

async function loadVideo(numero) {
    currentVideo = Math.min(Math.max(numero, 1), totalVideos);
    videoTitle.textContent = `Contenido ${String(currentVideo).padStart(2, "0")}`;
    playerContainer.classList.add("ascf-loading");
    updateNavigation();
    window.history.replaceState({}, "", `video.html?contenido=${currentVideo}`);

    if (player) {
        player.stop();
        player = null;
    }

    // Reset inner markup so AscilinePlayer starts with a clean container
    playerContainer.innerHTML = `
        <div class="status" id="status">Preparando video...</div>
        <pre class="ascii-player"></pre>
        <canvas class="ascii-canvas"></canvas>
        <audio class="ascii-audio" preload="none"></audio>
    `;

    const ascfUrl = ascfSource(currentVideo);
    const mp3Url = audioSource(currentVideo);
    const hasAudio = await audioExists(mp3Url);

    player = new AscilinePlayer(playerContainer, { loop: false });

    try {
        await player.play(ascfUrl, hasAudio ? mp3Url : null);
        playerContainer.classList.remove("ascf-loading");
    } catch (err) {
        playerContainer.classList.remove("ascf-loading");
        const statusEl = playerContainer.querySelector(".status") || statusElement;
        statusEl.textContent = "Agrega el archivo .ascf para este contenido";
    }
}

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
        await playerContainer.requestFullscreen();
    } else {
        await document.exitFullscreen();
    }
});

loadVideo(currentVideo);
