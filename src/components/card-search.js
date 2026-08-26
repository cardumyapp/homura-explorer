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

        characterTraits:
            "Características",

        element: "Elemento",
        subtype: "Subtipo",
        finish: "Acabamento",
        product: "Produto",

        might: "Might",
        energyCost:
            "Custo de energia",
        powerCost:
            "Custo de poder",
        cardType:
            "Tipo da carta",
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

export function renderCardSearch(
    gameId,
    filters = {}
) {
    const game = getGame(gameId);

    if (!game) {
        return "";
    }

    return `
        <section
    class="mb-4 rounded-lg border border-slate-800 bg-slate-900 p-3"
>

            <div
                class="mb-4 flex items-center justify-between"
            >
                <div>
                    <h3 class="font-bold">
                        Busca e filtros
                    </h3>

                    <p
                        class="mt-1 text-xs text-slate-500"
                    >
                        ${game.name}
                    </p>
                </div>

                <button
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
                                    py-1
                                    text-sm
                                    outline-none
                                    focus:border-indigo-500
                                "
                            >

                        </div>

                    `).join("")}

                </div>

                <div
                    class="
                        mt-4
                        flex
                        flex-wrap
                        gap-3
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
                            rounded-lg
                            border
                            border-slate-700
                            bg-slate-950
                            px-3
                            py-2
                            text-sm
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
                            rounded-lg
                            border
                            border-slate-700
                            bg-slate-950
                            px-3
                            py-2
                            text-sm
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

        </section>
    `;
}