const catalogoGrid = document.getElementById("catalogo-grid");
const botonesPagina = document.querySelectorAll(".pagina-boton");
const cantidadesPorPagina = [10, 11, 10, 13];
const contenidos = cantidadesPorPagina.flatMap((cantidad, pagina) =>
    Array.from({ length: cantidad }, (_, indice) => ({
        numero: cantidadesPorPagina.slice(0, pagina).reduce((total, valor) => total + valor, 0) + indice + 1,
        pagina: pagina + 1
    }))
);

function crearTarjeta(contenido) {
    const tarjeta = document.createElement("a");
    tarjeta.className = "catalogo-card placeholder-card";
    tarjeta.href = `video.html?contenido=${contenido.numero}`;
    tarjeta.setAttribute("aria-label", `Abrir contenido ${contenido.numero}`);
    tarjeta.innerHTML = `
        <div class="placeholder-image">
            <i class="bi bi-image" aria-hidden="true"></i>
        </div>
        <h2>Contenido ${String(contenido.numero).padStart(2, "0")}</h2>
    `;
    return tarjeta;
}

function mostrarPagina(numeroPagina) {
    const contenidosPagina = contenidos.filter((contenido) => contenido.pagina === numeroPagina);
    catalogoGrid.replaceChildren(...contenidosPagina.map(crearTarjeta));

    botonesPagina.forEach((boton) => {
        const activo = Number(boton.dataset.pagina) === numeroPagina;
        boton.classList.toggle("activo", activo);
        if (activo) {
            boton.setAttribute("aria-current", "page");
        } else {
            boton.removeAttribute("aria-current");
        }
    });
}

botonesPagina.forEach((boton) => {
    boton.addEventListener("click", () => {
        mostrarPagina(Number(boton.dataset.pagina));
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
});

mostrarPagina(1);
