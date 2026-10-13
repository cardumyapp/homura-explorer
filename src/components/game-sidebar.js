import { games } from "../config/games.js";

export function renderGameSidebar(
    selectedGame
) {
    return `
        <aside
            class="hidden w-48 shrink-0 border-r border-slate-800 bg-slate-900 lg:block xl:w-52"
        >

            <div
                class="border-b border-slate-800 p-3"
            >
                <h1 class="text-sm font-bold">
                    Homura Explorer
                </h1>
            </div>

            <nav class="sticky top-0 max-h-[calc(100dvh-48px)] overflow-y-auto p-2">
                <a href="/" class="mb-2 block rounded-lg px-2.5 py-1.5 text-xs font-semibold ${selectedGame === null ? "bg-indigo-600 text-white" : "text-indigo-300 hover:bg-slate-800"}">Início</a>

                ${[...games]
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"))
    .map((game) => `
        <${selectedGame === null ? "a" : "button"}
            ${selectedGame === null ? `href="/cards?game=${encodeURIComponent(game.id)}"` : `data-game="${game.id}"`}
            class="
                mb-0.5
                w-full
                rounded-lg
                px-2.5
                py-1.5
                text-left
                text-xs
                ${
                    game.id === selectedGame
                        ? "bg-indigo-600 text-white"
                        : "text-slate-300 hover:bg-slate-800"
                }
            "
        >
            ${game.name}
        </${selectedGame === null ? "a" : "button"}>
    `)
    .join("")}

            </nav>

        </aside>
    `;
}