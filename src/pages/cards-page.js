import {
    getCards,
} from "../api/homura.js";

import {
    getGame,
} from "../config/games.js";

import {
    renderGameSidebar,
} from "../components/game-sidebar.js";

import {
    renderGameSelector,
} from "../components/game-selector.js";

import {
    renderCardGrid,
} from "../components/card-grid.js";

import {
    renderCardModal,
} from "../components/card-modal.js";

import {
    renderCardSearch,
} from "../components/card-search.js";


let selectedGame = "one-piece";

let cards = [];

let page = 1;

let total = 0;

let totalPages = 1;

let filters = {};

let sort = "";

let order = "asc";

let initialized = false;


/*
|--------------------------------------------------------------------------
| Inicialização da página
|--------------------------------------------------------------------------
*/

export async function renderCardsPage() {

    // Primeiro cria a estrutura da página.
    render();

    initialized = true;

    // Depois busca as cartas.
    await loadCards();

}


/*
|--------------------------------------------------------------------------
| Consulta API
|--------------------------------------------------------------------------
*/

async function loadCards() {

    showGridLoading();

    try {

        const result = await getCards(
            selectedGame,
            {
                ...filters,

                page,

                limit: 30,

                sort:
                    sort || undefined,

                order,
            }
        );


        cards =
            Array.isArray(result?.data)
                ? result.data
                : [];


        total =
            Number(
                result?.total ??
                cards.length
            );


        totalPages =
            Number(
                result?.totalPages ??
                1
            );


        updatePageContent();

    } catch (error) {

        console.error(
            "Erro ao carregar cartas:",
            error
        );

        showGridError(error);

    }

}


/*
|--------------------------------------------------------------------------
| Render principal
|--------------------------------------------------------------------------
*/

function render() {

    const game =
        getGame(selectedGame);


    document.querySelector("#app")
        .innerHTML = `

        <div
            class="
                flex
                min-h-screen
                bg-slate-950
                text-white
            "
        >

            ${renderGameSidebar(
                selectedGame
            )}


            <main
                class="
                    min-w-0
                    flex-1
                    p-4
                    md:p-5
                "
            >

                <!-- Cabeçalho -->

                <div
                    class="
                        mb-4
                        flex
                        items-center
                        justify-between
                    "
                >

                    <div>

                        <h2
                            id="gameTitle"
                            class="
                                text-2xl
                                font-bold
                            "
                        >
                            ${
                                game?.name ||
                                selectedGame
                            }
                        </h2>


                        <p
                            id="gameTotal"
                            class="
                                mt-1
                                text-xs
                                text-slate-500
                            "
                        >
                            Carregando...
                        </p>

                    </div>


                    <a
                        href="/api-tester"
                        class="
                            rounded-lg
                            border
                            border-slate-700
                            px-3
                            py-2
                            text-xs
                            font-bold
                            text-slate-300
                            hover:border-indigo-500
                            hover:text-white
                        "
                    >
                        API Tester
                    </a>

                </div>

                ${renderGameSelector(gameId)}            
                <!-- Filtros -->

                <div id="filtersArea">

                    ${renderCardSearch(
                        selectedGame,
                        filters
                    )}

                </div>


                <!-- Grid -->

                <div
                    id="cards"
                    class="
                        grid
                        grid-cols-3
                        gap-2
                        sm:grid-cols-4
                        md:grid-cols-5
                        lg:grid-cols-6
                        xl:grid-cols-8
                        2xl:grid-cols-10
                    "
                >
                </div>


                <!-- Paginação -->

                <div
                    id="paginationArea"
                    class="mt-5"
                >
                </div>


            </main>


            <div id="modalRoot"></div>

        </div>
    `;


    bindEvents();

}


/*
|--------------------------------------------------------------------------
| Atualização parcial
|--------------------------------------------------------------------------
*/

function updatePageContent() {

    const game =
        getGame(selectedGame);


    const title =
        document.querySelector(
            "#gameTitle"
        );


    const totalElement =
        document.querySelector(
            "#gameTotal"
        );


    const filtersArea =
        document.querySelector(
            "#filtersArea"
        );


    const cardsArea =
        document.querySelector(
            "#cards"
        );


    const paginationArea =
        document.querySelector(
            "#paginationArea"
        );


    /*
     * Título
     */

    if (title) {

        title.textContent =
            game?.name ||
            selectedGame;

    }


    /*
     * Quantidade
     */

    if (totalElement) {

        totalElement.textContent =
            `${total.toLocaleString(
                "pt-BR"
            )} resultados`;

    }


    /*
     * Filtros
     */

    if (filtersArea) {

        filtersArea.innerHTML =
            renderCardSearch(
                selectedGame,
                filters
            );

    }


    /*
     * Cartas
     */

    if (cardsArea) {

        cardsArea.innerHTML =
            renderCardGrid(cards);

    }


    /*
     * Paginação
     */

    if (paginationArea) {

        paginationArea.innerHTML =
            renderPagination();

    }


    /*
     * Como alteramos partes do DOM,
     * precisamos registrar novamente
     * os eventos dessas partes.
     */

    bindDynamicEvents();

}


/*
|--------------------------------------------------------------------------
| Paginação
|--------------------------------------------------------------------------
*/

function renderPagination() {

    return `

        <div
            class="
                flex
                items-center
                justify-center
                gap-3
            "
        >

            <button
                id="previousPageBtn"
                ${page <= 1
                    ? "disabled"
                    : ""
                }
                class="
                    rounded-md
                    border
                    border-slate-700
                    px-3
                    py-1.5
                    text-xs
                    hover:border-indigo-500
                    disabled:cursor-not-allowed
                    disabled:opacity-30
                "
            >
                Anterior
            </button>


            <span
                class="
                    text-xs
                    text-slate-500
                "
            >
                ${page} / ${totalPages}
            </span>


            <button
                id="nextPageBtn"
                ${page >= totalPages
                    ? "disabled"
                    : ""
                }
                class="
                    rounded-md
                    border
                    border-slate-700
                    px-3
                    py-1.5
                    text-xs
                    hover:border-indigo-500
                    disabled:cursor-not-allowed
                    disabled:opacity-30
                "
            >
                Próxima
            </button>

        </div>
    `;

}


/*
|--------------------------------------------------------------------------
| Loading apenas no grid
|--------------------------------------------------------------------------
*/

function showGridLoading() {

    const cardsArea =
        document.querySelector(
            "#cards"
        );


    if (!cardsArea) {
        return;
    }


    cardsArea.innerHTML = `

        <div
            class="
                col-span-full
                flex
                min-h-[300px]
                items-center
                justify-center
                text-sm
                text-slate-500
            "
        >
            Carregando cartas...
        </div>

    `;


    const paginationArea =
        document.querySelector(
            "#paginationArea"
        );


    if (paginationArea) {

        paginationArea.innerHTML = "";

    }

}


/*
|--------------------------------------------------------------------------
| Erro apenas no grid
|--------------------------------------------------------------------------
*/

function showGridError(error) {

    const cardsArea =
        document.querySelector(
            "#cards"
        );


    if (!cardsArea) {

        console.error(error);

        return;

    }


    cardsArea.innerHTML = `

        <div
            class="
                col-span-full
                flex
                min-h-[300px]
                flex-col
                items-center
                justify-center
                gap-3
            "
        >

            <div
                class="
                    text-sm
                    text-red-400
                "
            >
                ${error.message}
            </div>


            <button
                id="retryBtn"
                class="
                    rounded-lg
                    bg-indigo-600
                    px-4
                    py-2
                    text-xs
                    font-bold
                    hover:bg-indigo-500
                "
            >
                Tentar novamente
            </button>

        </div>
    `;


    document
        .querySelector("#retryBtn")
        ?.addEventListener(
            "click",
            loadCards
        );

}


/*
|--------------------------------------------------------------------------
| Eventos
|--------------------------------------------------------------------------
*/

function bindEvents() {

    bindGameEvents();

    bindDynamicEvents();

}


function bindDynamicEvents() {

    bindCardEvents();

    bindFilterEvents();

    bindPaginationEvents();

}


/*
|--------------------------------------------------------------------------
| Troca de jogo
|--------------------------------------------------------------------------
*/

function bindGameEvents() {

    document
        .querySelectorAll(
            "[data-game]"
        )
        .forEach((button) => {

            button.addEventListener(
                "click",
                async () => {

                    const newGame =
                        button.dataset.game;


                    if (
                        newGame ===
                        selectedGame
                    ) {
                        return;
                    }


                    selectedGame =
                        newGame;


                    /*
                     * Reseta estado.
                     */

                    page = 1;

                    filters = {};

                    sort = "";

                    order = "asc";


                    /*
                     * Atualiza visualmente
                     * a sidebar imediatamente.
                     */

                    updateSidebar();


                    /*
                     * Atualiza título imediatamente.
                     */

                    const game =
                        getGame(
                            selectedGame
                        );


                    const title =
                        document.querySelector(
                            "#gameTitle"
                        );


                    if (title) {

                        title.textContent =
                            game?.name ||
                            selectedGame;

                    }


                    /*
                     * Atualiza os filtros
                     * imediatamente.
                     */

                    const filtersArea =
                        document.querySelector(
                            "#filtersArea"
                        );


                    if (filtersArea) {

                        filtersArea.innerHTML =
                            renderCardSearch(
                                selectedGame,
                                {}
                            );

                    }


                    /*
                     * Como recriamos filtros,
                     * registra evento do formulário.
                     */

                    bindFilterEvents();


                    /*
                     * Apenas o grid fica em loading.
                     */

                    await loadCards();

                }
            );

        });

}


/*
|--------------------------------------------------------------------------
| Sidebar ativa
|--------------------------------------------------------------------------
*/

function updateSidebar() {

    document
        .querySelectorAll(
            "[data-game]"
        )
        .forEach((button) => {

            const active =
                button.dataset.game ===
                selectedGame;


            if (active) {

                button.classList.add(
                    "bg-indigo-600",
                    "text-white"
                );

                button.classList.remove(
                    "text-slate-300"
                );

            } else {

                button.classList.remove(
                    "bg-indigo-600",
                    "text-white"
                );

                button.classList.add(
                    "text-slate-300"
                );

            }

        });

}


/*
|--------------------------------------------------------------------------
| Clique nas cartas
|--------------------------------------------------------------------------
*/

function bindCardEvents() {

    document
        .querySelectorAll(
            "[data-card-index]"
        )
        .forEach((element) => {

            element.addEventListener(
                "click",
                () => {

                    const index =
                        Number(
                            element.dataset
                                .cardIndex
                        );


                    const card =
                        cards[index];


                    if (!card) {
                        return;
                    }


                    openModal(card);

                }
            );

        });

}


/*
|--------------------------------------------------------------------------
| Filtros
|--------------------------------------------------------------------------
*/

function bindFilterEvents() {

    const form =
        document.querySelector(
            "#filterForm"
        );


    form?.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const formData =
                new FormData(form);


            filters = {};


            for (
                const [key, value]
                of formData.entries()
            ) {

                const cleanValue =
                    String(value).trim();


                if (cleanValue) {

                    filters[key] =
                        cleanValue;

                }

            }


            sort =
                document.querySelector(
                    "#sortField"
                )?.value || "";


            order =
                document.querySelector(
                    "#sortOrder"
                )?.value || "asc";


            page = 1;


            await loadCards();

        }
    );


    document
        .querySelector(
            "#clearFiltersBtn"
        )
        ?.addEventListener(
            "click",
            async () => {

                filters = {};

                sort = "";

                order = "asc";

                page = 1;


                await loadCards();

            }
        );

}


/*
|--------------------------------------------------------------------------
| Paginação
|--------------------------------------------------------------------------
*/

function bindPaginationEvents() {

    document
        .querySelector(
            "#previousPageBtn"
        )
        ?.addEventListener(
            "click",
            async () => {

                if (page <= 1) {
                    return;
                }


                page--;


                await loadCards();

            }
        );


    document
        .querySelector(
            "#nextPageBtn"
        )
        ?.addEventListener(
            "click",
            async () => {

                if (
                    page >=
                    totalPages
                ) {
                    return;
                }


                page++;


                await loadCards();

            }
        );

}


/*
|--------------------------------------------------------------------------
| Modal
|--------------------------------------------------------------------------
*/

function openModal(card) {

    const root =
        document.querySelector(
            "#modalRoot"
        );


    if (!root) {
        return;
    }


    root.innerHTML =
        renderCardModal(card);


    document
        .querySelector(
            "#closeModal"
        )
        ?.addEventListener(
            "click",
            closeModal
        );


    document
        .querySelector("#modal")
        ?.addEventListener(
            "click",
            (event) => {

                if (
                    event.target.id ===
                    "modal"
                ) {

                    closeModal();

                }

            }
        );

}


function closeModal() {

    const root =
        document.querySelector(
            "#modalRoot"
        );


    if (root) {

        root.innerHTML = "";

    }

}