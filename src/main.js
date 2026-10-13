import "./style.css";
import { renderHomePage } from "./pages/home-page.js";

import {
    renderCardsPage,
} from "./pages/cards-page.js";

if (window.location.pathname === "/cards") {
    renderCardsPage();
} else {
    renderHomePage();
}

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