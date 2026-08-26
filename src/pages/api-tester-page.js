import {
    getApiInfo,
    getCardById,
    lookupCard,
    getRandomCard,
    getCardsBulk,
} from "../api/homura.js";

import {
    games,
} from "../config/games.js";

import {
    renderApiTester,
} from "../components/api-tester.js";

let selectedGame = "one-piece";

export function renderApiTesterPage() {
    document.querySelector("#app")
        .innerHTML = `
            <main class="min-h-screen bg-slate-950 p-5 text-white">

                <div class="mx-auto max-w-5xl">

                    <div class="mb-5 flex items-center justify-between">

                        <div>
                            <h1 class="text-2xl font-bold">
                                API Tester
                            </h1>

                            <p class="mt-1 text-xs text-slate-500">
                                Homura API
                            </p>
                        </div>

                        <a
                            href="/"
                            class="rounded-lg border border-slate-700 px-3 py-2 text-xs hover:border-indigo-500"
                        >
                            Voltar para cartas
                        </a>

                    </div>

                    <div class="mb-4">

                        <label class="mb-1 block text-xs text-slate-400">
                            Jogo
                        </label>

                        <select
                            id="testerGame"
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

                    </div>

                    ${renderApiTester()}

                </div>

            </main>
        `;

    bindEvents();
}

function bindEvents() {
    document
        .querySelector("#testerGame")
        ?.addEventListener(
            "change",
            (event) => {
                selectedGame =
                    event.target.value;
            }
        );

    document
        .querySelectorAll("[data-api-test]")
        .forEach((button) => {
            button.addEventListener(
                "click",
                () => {
                    runApiTest(
                        button.dataset.apiTest
                    );
                }
            );
        });

    document
        .querySelector("#clearTesterBtn")
        ?.addEventListener(
            "click",
            () => {
                document.querySelector(
                    "#testerResult"
                ).textContent =
                    "Selecione um endpoint.";
            }
        );
}

async function runApiTest(type) {
    const output =
        document.querySelector(
            "#testerResult"
        );

    output.textContent =
        "Carregando...";

    try {
        let result;

        switch (type) {
            case "info":
                result =
                    await getApiInfo();
                break;

            case "random":
                result =
                    await getRandomCard(
                        selectedGame
                    );
                break;

            case "id": {
                const id =
                    document.querySelector(
                        "#testerCardId"
                    ).value.trim();

                if (!id) {
                    throw new Error(
                        "Informe um ID."
                    );
                }

                result =
                    await getCardById(
                        selectedGame,
                        id
                    );

                break;
            }

            case "lookup": {
                const query =
                    document.querySelector(
                        "#testerLookup"
                    ).value.trim();

                if (!query) {
                    throw new Error(
                        "Informe um valor."
                    );
                }

                result =
                    await lookupCard(
                        selectedGame,
                        query
                    );

                break;
            }

            case "bulk": {
                const ids =
                    document.querySelector(
                        "#testerBulk"
                    )
                    .value
                    .split("\n")
                    .map((id) => id.trim())
                    .filter(Boolean);

                if (!ids.length) {
                    throw new Error(
                        "Informe pelo menos um ID."
                    );
                }

                result =
                    await getCardsBulk(
                        selectedGame,
                        ids
                    );

                break;
            }
        }

        output.textContent =
            JSON.stringify(
                result,
                null,
                2
            );

    } catch (error) {
        output.textContent =
            `Erro: ${error.message}`;
    }
}