import { games } from "../config/games.js";

export function renderGameSelector(selectedGame) {
    return `
        <div class="mb-4 md:hidden">
            <label
                for="mobileGameSelect"
                class="mb-1 block text-xs text-slate-400"
            >
                Jogo
            </label>

            <select
                id="mobileGameSelect"
                class="
                    w-full
                    rounded-lg
                    border
                    border-slate-700
                    bg-slate-900
                    px-3
                    py-2
                    text-sm
                    text-white
                    outline-none
                    focus:border-indigo-500
                "
            >
                ${[...games]
                    .sort((a, b) =>
                        a.name.localeCompare(b.name, "pt-BR")
                    )
                    .map((game) => `
                        <option
                            value="${game.id}"
                            ${game.id === selectedGame ? "selected" : ""}
                        >
                            ${game.name}
                        </option>
                    `)
                    .join("")}
            </select>
        </div>
    `;
}
