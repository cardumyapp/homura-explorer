import {
    getRandomCardV2,
} from "../api/homura.js";

import {
    games,
} from "../config/games.js";

import hljs from "highlight.js/lib/core";
import json from "highlight.js/lib/languages/json";

import "highlight.js/styles/an-old-hope.css";

hljs.registerLanguage(
    "json",
    json
);

let selectedGame =
    localStorage.getItem("homura-selected-game")
    || "one-piece";

export function renderRandomV2Page() {
    document.querySelector("#app")
        .innerHTML = `
            <main class="min-h-screen bg-slate-950 p-5 text-white">

                <div class="mx-auto max-w-5xl">

                    <div class="mb-5 flex items-center justify-between">

                        <div>
                            <h1 class="text-2xl font-bold">
                                Random V2 Tester
                            </h1>

                            <p class="mt-1 text-xs text-slate-500">
                                /api/{game}/cards/random/v2
                            </p>
                        </div>

                        <a
                            href="/"
                            class="rounded-lg border border-slate-700 px-3 py-2 text-xs hover:border-indigo-500"
                        >
                            Voltar
                        </a>

                    </div>

                    <div class="mb-4 flex gap-2">

                        <select
                            id="randomGame"
                            class="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                        >
                            ${games.map((game) => `
                                <option
                                    value="${game.id}"
                                    ${
                                        game.id === selectedGame
                                            ? "selected"
                                            : ""
                                    }
                                >
                                    ${game.name}
                                </option>
                            `).join("")}
                        </select>

                        <button
                            id="randomBtn"
                            class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold hover:bg-indigo-500"
                        >
                            Buscar carta
                        </button>

                    </div>

                    <div id="randomResult">
    <div
        class="
            flex
            min-h-[300px]
            items-center
            justify-center
            rounded-xl
            border
            border-slate-800
            bg-slate-900
            text-sm
            text-slate-500
        "
    >
        Clique em "Buscar carta".
    </div>
</div>

                </div>

            </main>
        `;

    bindEvents();
}

function highlightJson(value) {
    const json =
        JSON.stringify(
            value,
            null,
            2
        );

    return hljs.highlight(
        json,
        {
            language: "json",
        }
    ).value;
}

function bindEvents() {
    document
        .querySelector("#randomGame")
        ?.addEventListener(
            "change",
            (event) => {
                selectedGame =
                    event.target.value;

                localStorage.setItem(
                    "homura-selected-game",
                    selectedGame
                );
            }
        );

    document
        .querySelector("#randomBtn")
        ?.addEventListener(
            "click",
            loadRandomCard
        );
}

async function loadRandomCard() {
    const output =
        document.querySelector(
            "#randomResult"
        );

    output.innerHTML = `
        <div
            class="
                flex
                min-h-[300px]
                items-center
                justify-center
                text-sm
                text-slate-500
            "
        >
            Carregando...
        </div>
    `;

    try {
        const result =
            await getRandomCardV2(
                selectedGame
            );

        const principal =
            result?.data?.principal;

        const secundario =
            result?.data?.secundario;

        const match =
            result?.data?.match;

        output.innerHTML = `
            <div>

                <!-- Informações gerais -->

                <div
                    class="
                        mb-4
                        flex
                        flex-wrap
                        gap-2
                        text-xs
                    "
                >
                    <span
                        class="
                            rounded-lg
                            border
                            border-slate-700
                            bg-slate-900
                            px-3
                            py-2
                        "
                    >
                        Game:
                        <strong>
                            ${result?.game ?? "-"}
                        </strong>
                    </span>

                    <span
                        class="
                            rounded-lg
                            border
                            border-slate-700
                            bg-slate-900
                            px-3
                            py-2
                        "
                    >
                        Collection:
                        <strong>
                            ${result?.collection ?? "-"}
                        </strong>
                    </span>

                    <span
                        class="
                            rounded-lg
                            border
                            ${
                                match
                                    ? "border-green-800 bg-green-950 text-green-400"
                                    : "border-red-800 bg-red-950 text-red-400"
                            }
                            px-3
                            py-2
                            font-bold
                        "
                    >
                        Match:
                        ${match ? "TRUE" : "FALSE"}
                    </span>
                </div>


                <!-- Comparação -->

                <div
                    class="
                        grid
                        grid-cols-1
                        gap-4
                        lg:grid-cols-2
                    "
                >

                    <!-- Principal -->

                    <div class="min-w-0">

                        <div
                            class="
                                mb-2
                                text-sm
                                font-bold
                                text-indigo-400
                            "
                        >
                            PRINCIPAL
                        </div>

                        <pre
    class="
        max-h-[70vh]
        overflow-auto
        whitespace-pre-wrap
        break-words
        rounded-xl
        border
        border-slate-800
        bg-black
        p-4
        text-xs
        leading-relaxed
    "
><code class="hljs language-json">${highlightJson(principal)}</code></pre>

                    </div>


                    <!-- Secundário -->

                    <div class="min-w-0">

                        <div
                            class="
                                mb-2
                                text-sm
                                font-bold
                                text-indigo-400
                            "
                        >
                            SECUNDÁRIO
                        </div>

                        <pre
    class="
        max-h-[70vh]
        overflow-auto
        whitespace-pre-wrap
        break-words
        rounded-xl
        border
        border-slate-800
        bg-black
        p-4
        text-xs
        leading-relaxed
    "
><code class="hljs language-json">${highlightJson(secundario)}</code></pre>

                    </div>

                </div>

            </div>
        `;

    } catch (error) {
        output.innerHTML = `
            <div
                class="
                    rounded-xl
                    border
                    border-red-900
                    bg-red-950/30
                    p-4
                    text-sm
                    text-red-400
                "
            >
                Erro: ${error.message}
            </div>
        `;
    }
}