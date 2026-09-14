
const texto = document.getElementById("cargando");
const loadingScreen = document.getElementById("loading-screen");
const playerContainer = document.getElementById("player-container");
const loadingDelay = 1800;
let puntos = 0;

const loadingAnimation = setInterval(() => {
    puntos++;
    if (puntos > 3) {
        puntos = 0;
    }
    texto.textContent = "Cargando" + ".".repeat(puntos);
}, 500);

setTimeout(() => {
    clearInterval(loadingAnimation);
    loadingScreen.classList.add("is-hidden");
    playerContainer.classList.remove("is-loading");
    loadingScreen.addEventListener("transitionend", () => {
        loadingScreen.remove();
    }, { once: true });
}, loadingDelay);