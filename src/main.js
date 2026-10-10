import "./style.css";

import {
    renderCardsPage,
} from "./pages/cards-page.js";

renderCardsPage();

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("/sw.js")
            .then(() => {
                console.log(
                    "Service Worker registrado"
                );
            })
            .catch((error) => {
                console.error(
                    "Erro ao registrar Service Worker:",
                    error
                );
            });
    });
}