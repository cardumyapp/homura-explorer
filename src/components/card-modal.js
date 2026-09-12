import { getImage, escapeHtml } from "../utils/helpers.js";

function detail(label, value) {
    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {
        return "";
    }

    return `
        <div class="flex items-start justify-between gap-4 border-b border-slate-800 py-2">
            <span class="shrink-0 text-slate-400">
                ${escapeHtml(label)}
            </span>

            <strong class="min-w-0 break-words text-right">
                ${escapeHtml(value)}
            </strong>
        </div>
    `;
}


export function renderCardModal(card) {
    const image = getImage(card);

    return `
        <div
            id="modal"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2 sm:p-4"
        >
            <div
                class="
                    relative
                    flex
                    max-h-[95vh]
                    w-full
                    max-w-5xl
                    flex-col
                    overflow-hidden
                    rounded-xl
                    border
                    border-slate-800
                    bg-slate-900
                    shadow-2xl
                    md:grid
                    md:max-h-[90vh]
                    md:grid-cols-[minmax(280px,45%)_1fr]
                    md:rounded-2xl
                "
            >

                <!-- Imagem -->
                <div
                    class="
                        flex
                        min-h-0
                        shrink-0
                        items-center
                        justify-center
                        bg-black
                        p-4
                        md:h-full
                        md:p-6
                    "
                >
                    ${
                        image
                            ? `
                                <img
                                    src="${escapeHtml(image)}"
                                    alt="${escapeHtml(card?.name || "")}"
                                    class="
                                        max-h-[40vh]
                                        max-w-full
                                        rounded-xl
                                        object-contain
                                        md:max-h-[80vh]
                                    "
                                >
                            `
                            : `
                                <div class="text-sm text-slate-500">
                                    Sem imagem
                                </div>
                            `
                    }
                </div>


                <!-- Conteúdo -->
                <div
                    class="
                        min-h-0
                        flex-1
                        overflow-y-auto
                        p-4
                        sm:p-6
                    "
                >

                    <!-- Header -->
                    <div class="flex items-start justify-between gap-4">

                        <div class="min-w-0">
                            <h2
                                class="
                                    break-words
                                    pr-2
                                    text-xl
                                    font-bold
                                    sm:text-2xl
                                "
                            >
                                ${escapeHtml(card?.name || "Sem nome")}
                            </h2>

                            <p class="mt-2 break-all text-sm text-slate-400">
                                ${escapeHtml(card?.code || card?.id || "")}
                            </p>
                        </div>


                        <!-- Ações -->
                        <div class="flex shrink-0 items-center gap-2">

                            <button
                                id="viewRawJson"
                                type="button"
                                class="
                                    rounded-lg
                                    border
                                    border-slate-700
                                    bg-slate-800
                                    px-3
                                    py-2
                                    text-xs
                                    font-medium
                                    text-slate-200
                                    transition
                                    hover:border-slate-600
                                    hover:bg-slate-700
                                    sm:text-sm
                                "
                            >
                                View raw
                            </button>

                            <button
                                id="closeModal"
                                type="button"
                                aria-label="Fechar modal"
                                class="
                                    flex
                                    h-9
                                    w-9
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-slate-800
                                    text-xl
                                    text-slate-300
                                    transition
                                    hover:bg-slate-700
                                    hover:text-white
                                "
                            >
                                ×
                            </button>

                        </div>
                    </div>


                    <!-- Informações -->
                    <div class="mt-6 text-sm">
                        ${detail("Raridade", card?.rarity)}
                        ${detail("Tipo", card?.type)}
                        ${detail("Power", card?.power)}
                        ${detail("Cost", card?.cost)}
                        ${detail("Level", card?.level)}
                    </div>


                    <!-- Preview JSON -->
                    <div class="mt-3 pt-4">

                        <div class="mb-3 flex items-center justify-between gap-4">
                            <span class="text-sm font-semibold text-slate-300">
                                JSON
                            </span>

                            <span class="text-xs text-slate-500">
                                Preview
                            </span>
                        </div>

                        <pre
                            class="
                                max-h-72
                                overflow-auto
                                rounded-xl
                                border
                                border-slate-800
                                bg-black
                                p-3
                                text-[11px]
                                leading-relaxed
                                text-slate-300
                                sm:p-4
                                sm:text-xs
                            "
                        ><code>${escapeHtml(
                            JSON.stringify(card, null, 2)
                        )}</code></pre>

                    </div>

                </div>
            </div>
        </div>
    `;
}


export function bindCardModalEvents(card) {
    const rawButton =
        document.getElementById("viewRawJson");

    rawButton?.addEventListener("click", () => {
        const json = JSON.stringify(
            card,
            null,
            2
        );

        const blob = new Blob(
            [json],
            {
                type: "application/json",
            }
        );

        const url =
            URL.createObjectURL(blob);

        window.open(
            url,
            "_blank"
        );

        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 60000);
    });
}