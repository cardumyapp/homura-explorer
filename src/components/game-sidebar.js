import { games } from "../config/games.js";

export function renderGameSidebar(
    selectedGame
) {
    return `
        <aside
            class="hidden w-64 shrink-0 border-r border-slate-800 bg-slate-900 md:block"
        >

            <div
                class="border-b border-slate-800 p-5"
            >
                <h1 class="text-lg font-bold">
                    Homura Explorer
                </h1>
            </div>

            <nav class="p-3">

                ${[...games]
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"))
    .map((game) => `
        <button
            data-game="${game.id}"
            class="
                mb-1
                w-full
                rounded-lg
                px-3
                py-2
                text-left
                text-sm
                ${
                    game.id === selectedGame
                        ? "bg-indigo-600 text-white"
                        : "text-slate-300 hover:bg-slate-800"
                }
            "
        >
            ${game.name}
        </button>
    `)
    .join("")}

            </nav>

        </aside>
    `;
}