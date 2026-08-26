import {
    getImage,
    escapeHtml,
} from "../utils/helpers.js";

export function renderCardGrid(cards) {
    if (!cards.length) {
        return `
            <div class="col-span-full py-8 text-center text-sm text-slate-500">
                Nenhuma carta encontrada.
            </div>
        `;
    }

    return cards.map((card, index) => {
        const image = getImage(card);

        return `
            <article
                data-card-index="${index}"
                class="
                    cursor-pointer
                    overflow-hidden
                    rounded-lg
                    border
                    border-slate-800
                    bg-slate-900
                    transition
                    hover:border-indigo-500
                "
            >

                <div class="aspect-[3/4] bg-black">

                    ${
                        image
                            ? `
                                <img
                                    src="${escapeHtml(image)}"
                                    alt="${escapeHtml(card?.name || "")}"
                                    loading="lazy"
                                    class="h-full w-full object-cover"
                                >
                            `
                            : `
                                <div class="flex h-full items-center justify-center text-[10px] text-slate-600">
                                    Sem imagem
                                </div>
                            `
                    }

                </div>

                <div class="p-2">

                    <h3
                        class="
                            truncate
                            text-[11px]
                            font-semibold
                        "
                        title="${escapeHtml(card?.name || "")}"
                    >
                        ${escapeHtml(card?.name || "Sem nome")}
                    </h3>

                    <p
                        class="
                            mt-0.5
                            truncate
                            text-[9px]
                            text-indigo-400
                        "
                    >
                        ${escapeHtml(card?.code || card?.id || "")}
                    </p>

                </div>

            </article>
        `;
    }).join("");
}