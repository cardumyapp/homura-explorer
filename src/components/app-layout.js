import { renderGameSidebar } from "./game-sidebar.js";
import { games } from "../config/games.js";
import { escapeHtml } from "../utils/helpers.js";

export function renderAppLayout(content, selectedGame = null) {
    return `
        <div class="flex min-h-screen min-w-0 bg-slate-950 text-white">
            ${renderGameSidebar(selectedGame)}
            <div class="min-w-0 flex-1">
                <nav aria-label="Navegação móvel" class="flex items-center gap-2 overflow-x-auto border-b border-slate-800 bg-slate-900 px-3 py-2 lg:hidden">
                    <a href="/" class="shrink-0 rounded-md px-3 py-2 text-xs ${selectedGame === null ? "bg-indigo-600 text-white" : "text-slate-300"}">Início</a>
                    <label for="layoutGameSelect" class="sr-only">Selecionar jogo</label>
                    <select id="layoutGameSelect" class="min-w-0 flex-1 rounded-md border border-slate-700 bg-slate-950 px-2 py-2 text-xs text-white">
                        <option value="">Selecionar jogo</option>
                        ${games.map(game => `<option value="${escapeHtml(game.id)}" ${selectedGame === game.id ? "selected" : ""}>${escapeHtml(game.name)}</option>`).join("")}
                    </select>
                </nav>
                <main class="min-w-0 p-2.5 sm:p-3 xl:p-4">
                    ${content}
                </main>
            </div>
        </div>
    `;
}

export function bindAppLayoutNavigation() {
    document.querySelector("#layoutGameSelect")?.addEventListener("change", event => {
        if (event.target.value) window.location.href = "/cards?game=" + encodeURIComponent(event.target.value);
    });
}
