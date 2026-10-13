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

import { registerSW } from "virtual:pwa-register";

let updateSW;
function showUpdateNotice() {
    if (document.querySelector("#pwaUpdateNotice")) return;

    const notice = document.createElement("div");
    notice.id = "pwaUpdateNotice";
    notice.setAttribute("role", "alert");
    notice.className = "fixed bottom-4 left-4 right-4 z-[100] mx-auto flex max-w-md flex-wrap items-center justify-between gap-3 rounded-xl border border-indigo-500/50 bg-slate-900 p-3 text-white shadow-2xl sm:left-auto sm:right-4 sm:mx-0";
    notice.innerHTML = `
        <div class="min-w-0 flex-1">
            <p class="text-sm font-bold">Nova versão disponível</p>
            <p class="mt-0.5 text-xs text-slate-300">Atualize para usar as últimas melhorias.</p>
        </div>
        <div class="flex items-center gap-2">
            <button type="button" id="pwaUpdateLater" class="rounded-lg border border-slate-700 px-3 py-2 text-xs hover:bg-slate-800">Depois</button>
            <button type="button" id="pwaUpdateNow" class="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold hover:bg-indigo-500">Atualizar</button>
        </div>`;
    document.body.appendChild(notice);

    notice.querySelector("#pwaUpdateLater").addEventListener("click", () => notice.remove());
    notice.querySelector("#pwaUpdateNow").addEventListener("click", async event => {
        event.currentTarget.disabled = true;
        event.currentTarget.textContent = "Atualizando...";
        try {
            await updateSW(true);
        } catch (error) {
            console.error("Falha ao atualizar o PWA:", error);
            event.currentTarget.disabled = false;
            event.currentTarget.textContent = "Tentar novamente";
        }
    });
}

if ("serviceWorker" in navigator) {
    let registration;
    const checkForUpdates = () => {
        if (navigator.onLine && registration && !registration.installing) {
            registration.update().catch(error => console.warn("Falha ao verificar atualização:", error));
        }
    };

    updateSW = registerSW({
        immediate: true,
        onNeedRefresh: showUpdateNotice,
        onRegisteredSW(_swUrl, swRegistration) {
            registration = swRegistration;
            setInterval(checkForUpdates, 5 * 60 * 1000);
            window.addEventListener("focus", checkForUpdates);
            document.addEventListener("visibilitychange", () => {
                if (document.visibilityState === "visible") checkForUpdates();
            });
        },
        onRegisterError(error) {
            console.error("Erro ao registrar Service Worker:", error);
        }
    });
}
