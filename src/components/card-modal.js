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
        <div class="flex justify-between gap-4 border-b border-slate-800 py-2">
            <span class="text-slate-400">
                ${escapeHtml(label)}
            </span>

            <strong>
                ${escapeHtml(value)}
            </strong>
        </div>
    `;
}

export function renderCardModal(card) {
    const image = getImage(card);

    const cardJson = escapeHtml(
        JSON.stringify(card, null, 2)
    );

    return `
        <div
            id="modal"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
        >
            <div class="relative grid max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 md:grid-cols-2">

                <button
                    id="closeModal"
                    class="absolute right-3 top-3 z-10 rounded-full bg-slate-800 px-3 py-1 text-xl"
                >
                    ×
                </button>

                <div class="flex items-center justify-center bg-black p-6">
                    ${
                        image
                            ? `
                                <img
                                    src="${escapeHtml(image)}"
                                    alt="${escapeHtml(card?.name || "")}"
                                    class="max-h-[70vh] rounded-xl object-contain"
                                >
                            `
                            : ""
                    }
                </div>

                <div class="overflow-y-auto p-6">
                    <h2 class="text-2xl font-bold">
                        ${escapeHtml(card?.name || "Sem nome")}
                    </h2>

                    <p class="mt-2 text-sm text-slate-400">
                        ${escapeHtml(card?.code || card?.id || "")}
                    </p>

                    <div class="mt-6 text-sm">
                        ${detail("Raridade", card?.rarity)}
                        ${detail("Tipo", card?.type)}
                        ${detail("Power", card?.power)}
                        ${detail("Cost", card?.cost)}
                        ${detail("Level", card?.level)}
                    </div>

                    <details class="mt-6 border-t border-slate-800 pt-4">
                        <summary
                            class="cursor-pointer select-none text-sm font-semibold text-slate-300 hover:text-white"
                        >
                            Ver JSON completo
                        </summary>

                        <pre
                            class="mt-4 max-h-96 overflow-auto rounded-xl bg-black p-4 text-xs leading-relaxed text-slate-300"
                        ><code>${cardJson}</code></pre>
                    </details>
                </div>
            </div>
        </div>
    `;
}