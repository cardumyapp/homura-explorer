import { games } from "../config/games.js";
import { escapeHtml } from "../utils/helpers.js";

export function renderGameSidebar(selectedGame = null) {
    const sortedGames = [...games].sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
    return `
        <aside class="hidden h-dvh w-48 shrink-0 flex-col border-r border-slate-800 bg-slate-900 lg:sticky lg:top-0 lg:flex xl:w-52">
            <div class="shrink-0 border-b border-slate-800 px-3 py-3">
                <a href="/" class="block text-sm font-bold text-white">Homura Explorer</a>
            </div>
            <nav aria-label="Navegação principal" class="min-h-0 flex-1 overflow-y-auto p-2">
                <a href="/" ${selectedGame === null ? 'aria-current="page"' : ""}
                    class="mb-2 block rounded-lg px-2.5 py-2 text-left text-xs font-semibold transition ${selectedGame === null ? "bg-indigo-600 text-white" : "text-indigo-300 hover:bg-slate-800"}">Início</a>
                <div class="mb-1 px-2.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">Jogos</div>
                <div class="flex flex-col gap-0.5">
                    ${sortedGames.map(game => `
                        <a href="/cards?game=${encodeURIComponent(game.id)}" data-game="${escapeHtml(game.id)}"
                           ${selectedGame === game.id ? 'aria-current="page"' : ""}
                           class="block w-full rounded-lg px-2.5 py-1.5 text-left text-xs leading-5 transition ${selectedGame === game.id ? "bg-indigo-600 text-white" : "text-slate-300 hover:bg-slate-800"}">
                            ${escapeHtml(game.name)}
                        </a>
                    `).join("")}
                </div>
            </nav>
        </aside>
    `;
}
