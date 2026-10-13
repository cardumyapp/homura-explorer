import { renderGameSidebar } from "./game-sidebar.js";

export function renderAppLayout(content, selectedGame = null) {
    return `
        <div class="flex min-h-screen min-w-0 bg-slate-950 text-white">
            ${renderGameSidebar(selectedGame)}
            <main class="min-w-0 flex-1 p-2.5 sm:p-3 xl:p-4">
                ${content}
            </main>
        </div>
    `;
}
