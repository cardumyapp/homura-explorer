import { getGame } from "../config/games.js";

function getLabel(filter) {
    const labels = {
        id: "ID",
        code: "Código",
        name: "Nome",
        rarity: "Raridade",
        type: "Tipo",
        color: "Cor",
        cost: "Custo",
        power: "Poder",
        family: "Família",
        set: "Set",

        card_type: "Tipo Pokémon",
        stage: "Estágio",
        artist: "Artista",

        characterTraits: "Características",

        element: "Elemento",
        subtype: "Subtipo",
        finish: "Acabamento",
        product: "Produto",

        might: "Might",
        energyCost: "Custo de energia",
        powerCost: "Custo de poder",
        cardType: "Tipo da carta",
        domain: "Domínio",

        konami_id: "Konami ID",
        effect: "Efeito",
        attribute: "Atributo",
        frameType: "Frame",

        colors: "Cores",
        layout: "Layout",
        cmc: "CMC",
        language: "Idioma",
    };

    return labels[filter] || filter;
}

export function renderCardSearch(gameId, filters = {}) {
    const game = getGame(gameId);

    if (!game) {
        return "";
    }

    return `
        <section
            class="
                mb-4
                rounded-lg
                border
                border-slate-800
                bg-slate-900
                p-3
            "
        >

            <!-- Cabeçalho -->
            <div class="flex items-center justify-between gap-3">

                <div>
                    <h3 class="font-bold">
                        Busca e filtros
                    </h3>

                    <p class="mt-1 text-xs text-slate-500">
                        ${game.name}
                    </p>
                </div>

                <div class="flex items-center gap-3">

                    <button
                        type="button"
                        id="toggleFiltersBtn"
                        class="
                            inline-flex
                            items-center
                            gap-1
                            rounded-lg
                            border
                            border-slate-700
                            px-3
                            py-2
                            text-xs
                            text-slate-300
                            hover:bg-slate-800
                            md:hidden
                        "
                    >
                        <span>Filtros</span>

                        <svg
                            id="toggleFiltersIcon"
                            class="
                                h-4
                                w-4
                                transition-transform
                            "
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </button>

                    <button
                        type="button"
                        id="clearFiltersBtn"
                        class="
                            text-xs
                            text-slate-400
                            hover:text-white
                        "
                    >
                        Limpar
                    </button>

                </div>
            </div>

            <!-- Conteúdo dos filtros -->
            <div
                id="filtersContent"
                class="
                    mt-4
                    hidden
                    md:block
                "
            >

                <form id="filterForm">

                    <div
                        class="
                            grid
                            grid-cols-1
                            gap-3
                            sm:grid-cols-2
                            lg:grid-cols-6
                        "
                    >

                        ${game.filters.map((filter) => `

                            <div>

                                <label
                                    class="
                                        mb-1
                                        block
                                        text-xs
                                        text-slate-400
                                    "
                                >
                                    ${getLabel(filter)}
                                </label>

                                <input
                                    type="text"
                                    name="${filter}"
                                    value="${filters[filter] || ""}"
                                    placeholder="${getLabel(filter)}"
                                    class="
                                        w-full
                                        rounded-lg
                                        border
                                        border-slate-700
                                        bg-slate-950
                                        px-2
                                        py-2
                                        text-sm
                                        outline-none
                                        focus:border-indigo-500
                                    "
                                >

                            </div>

                        `).join("")}

                    </div>

                    <!-- Ações -->
                    <div
                        class="
                            mt-4
                            grid
                            grid-cols-1
                            gap-3
                            sm:flex
                            sm:flex-wrap
                        "
                    >

                        <button
                            type="submit"
                            class="
                                rounded-lg
                                bg-indigo-600
                                px-5
                                py-2
                                text-sm
                                font-bold
                                hover:bg-indigo-500
                            "
                        >
                            Buscar
                        </button>

                        <select
                            id="sortField"
                            class="
                                w-full
                                rounded-lg
                                border
                                border-slate-700
                                bg-slate-950
                                px-3
                                py-2
                                text-sm
                                sm:w-auto
                            "
                        >
                            <option value="">
                                Sem ordenação
                            </option>

                            <option value="name">
                                Nome
                            </option>

                            <option value="id">
                                ID
                            </option>

                            <option value="rarity">
                                Raridade
                            </option>
                        </select>

                        <select
                            id="sortOrder"
                            class="
                                w-full
                                rounded-lg
                                border
                                border-slate-700
                                bg-slate-950
                                px-3
                                py-2
                                text-sm
                                sm:w-auto
                            "
                        >
                            <option value="asc">
                                Crescente
                            </option>

                            <option value="desc">
                                Decrescente
                            </option>
                        </select>

                    </div>

                </form>
            </div>

        </section>
    `;
}
document.addEventListener("click", (event) => {
    const button = event.target.closest("#toggleFiltersBtn");

    if (!button) {
        return;
    }

    const content = document.getElementById("filtersContent");
    const icon = document.getElementById("toggleFiltersIcon");

    if (!content) {
        return;
    }

    const isHidden = content.classList.contains("hidden");

    content.classList.toggle("hidden", !isHidden);
    icon?.classList.toggle("rotate-180", isHidden);
});
