import { getRandomCards } from "../api/homura.js";
import { renderCardGrid } from "./card-grid.js";
import { renderCardModal } from "./card-modal.js";
import { escapeHtml } from "../utils/helpers.js";

let samples = [];
let rawResponse = null;
let requestId = 0;
let currentGame = "";

function showRaw(data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    setTimeout(() => URL.revokeObjectURL(url), 60000);
}

function closeSamplesModal() {
    requestId++;
    document.querySelector("#modalRoot").innerHTML = "";
}

function showSamplesModal() {
    const root = document.querySelector("#modalRoot");
    if (!root) return;

    root.innerHTML = `
        <div id="samplesOverlay" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2 sm:p-4">
            <section role="dialog" aria-modal="true" aria-label="Amostras de cartas" class="flex max-h-[95vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-2xl sm:max-h-[90vh] sm:rounded-2xl">
                <header class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 p-4">
                    <div>
                        <h2 class="text-xl font-bold">Amostras</h2>
                        <p class="text-xs text-slate-400">Cartas aleatórias de ${escapeHtml(currentGame)}</p>
                    </div>
                    <div class="flex items-center gap-2">
                        <label for="sampleSize" class="text-xs text-slate-400">Quantidade</label>
                        <select id="sampleSize" class="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm">
                            <option value="1">1</option>
                            <option value="10" selected>10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                        </select>
                        <button id="fetchSamples" class="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold hover:bg-indigo-500">Gerar</button>
                        <button id="closeSamples" aria-label="Fechar modal" class="rounded-lg bg-slate-800 px-3 py-2 text-lg hover:bg-slate-700">×</button>
                    </div>
                </header>
                <div class="min-h-0 overflow-y-auto p-4">
                    <div class="mb-3 flex items-center justify-between gap-2">
                        <p id="samplesStatus" class="text-sm text-slate-400" aria-live="polite"></p>
                        <button id="samplesRaw" class="hidden rounded-lg border border-slate-700 px-3 py-1.5 text-xs hover:bg-slate-800">View raw</button>
                    </div>
                    <div id="samplesGrid" class="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"></div>
                </div>
            </section>
        </div>`;

    root.querySelector("#closeSamples").addEventListener("click", closeSamplesModal);
    root.querySelector("#samplesOverlay").addEventListener("click", event => {
        if (event.target.id === "samplesOverlay") closeSamplesModal();
    });
    root.querySelector("#samplesRaw").addEventListener("click", () => showRaw(rawResponse));
    root.querySelector("#fetchSamples").addEventListener("click", loadSamples);
    root.querySelector("#samplesGrid").addEventListener("click", event => {
        const item = event.target.closest("[data-card-index]");
        if (!item) return;
        const card = samples[Number(item.dataset.cardIndex)];
        if (!card) return;
        root.innerHTML = renderCardModal(card);
        root.querySelector("#closeModal")?.addEventListener("click", showSamplesModal);
        root.querySelector("#viewRawJson")?.addEventListener("click", () => showRaw(card));
        root.querySelector("#modal")?.addEventListener("click", event => {
            if (event.target.id === "modal") showSamplesModal();
        });
    });
}

async function loadSamples() {
    const root = document.querySelector("#modalRoot");
    const grid = root?.querySelector("#samplesGrid");
    if (!grid) return;
    const id = ++requestId;
    const size = Number(root.querySelector("#sampleSize").value);
    const button = root.querySelector("#fetchSamples");
    const status = root.querySelector("#samplesStatus");
    button.disabled = true;
    status.textContent = "Carregando amostras...";
    grid.innerHTML = "";
    root.querySelector("#samplesRaw").classList.add("hidden");

    try {
        const result = await getRandomCards(currentGame, size);
        if (id !== requestId || !root.querySelector("#samplesGrid")) return;
        rawResponse = result;
        samples = Array.isArray(result) ? result : Array.isArray(result?.data) ? result.data : result?.data?.cards && Array.isArray(result.data.cards) ? result.data.cards : Array.isArray(result?.cards) ? result.cards : result?.data?.principal ? [result.data.principal] : [result?.data || result].filter(Boolean);
        status.textContent = `${samples.length} carta(s) recebida(s)`;
        grid.innerHTML = renderCardGrid(samples);
        root.querySelector("#samplesRaw").classList.remove("hidden");
    } catch (error) {
        if (id !== requestId || !root.querySelector("#samplesGrid")) return;
        status.textContent = "Erro ao carregar amostras.";
        grid.innerHTML = `<p class="col-span-full text-sm text-red-400">${escapeHtml(error.message)}</p>`;
    } finally {
        if (id === requestId && root.querySelector("#fetchSamples")) button.disabled = false;
    }
}

export function openSamplesModal(game) {
    requestId++;
    currentGame = game;
    samples = [];
    rawResponse = null;
    showSamplesModal();
    loadSamples();
}
