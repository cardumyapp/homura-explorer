import { getGame } from "../config/games.js";
import { escapeHtml } from "../utils/helpers.js";

export function renderCardSearch(gameId, filters = {}) {
    if (!getGame(gameId)) return "";

    return `
        <section class="mb-2 rounded-lg border border-slate-800 bg-slate-900 p-2.5">
            <form id="filterForm" class="flex flex-wrap items-end gap-2">
                ${[
                    ["id", "ID"],
                    ["name", "Nome"],
                    ["set", "Set"]
                ].map(([key, label]) => `
                    <div class="min-w-[110px] flex-1 sm:min-w-[145px] xl:max-w-[240px]">
                        <label for="filter-${key}" class="mb-0.5 block text-xs text-slate-400">${label}</label>
                        <input id="filter-${key}" type="text" name="${key}"
                            value="${escapeHtml(filters[key] || "")}"
                            placeholder="${label}"
                            class="w-full rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-2 text-xs text-white outline-none focus:border-indigo-500">
                    </div>
                `).join("")}
                <div class="flex shrink-0 flex-wrap items-center gap-2">
                    <button type="submit" class="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-bold hover:bg-indigo-500">Buscar</button>
                    <button type="button" id="clearFiltersBtn" class="rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800">Limpar</button>
                    <button type="button" id="openSamplesBtn" class="rounded-lg border border-indigo-500/40 bg-indigo-500/10 px-3 py-2 text-xs font-semibold text-indigo-300 hover:bg-indigo-500/20">Amostras</button>
                </div>
            </form>
        </section>
    `;
}
