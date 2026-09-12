import "./style.css";

import {
    renderCardsPage,
} from "./pages/cards-page.js";

import {
    renderApiTesterPage,
} from "./pages/api-tester-page.js";

const path =
    window.location.pathname;

if (path === "/api-tester") {
    renderApiTesterPage();
} else {
    renderCardsPage();
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