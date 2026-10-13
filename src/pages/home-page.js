import { getApiInfo } from "../api/homura.js";
import { escapeHtml } from "../utils/helpers.js";
import { renderGameSidebar } from "../components/game-sidebar.js";

const formatNumber = value => Number(value || 0).toLocaleString("pt-BR");
function formatDate(value) {
    if (!value) return "Sem atualização";
    const normalized = /(?:Z|[+-]\d\d:\d\d)$/.test(value) ? value : value + "Z";
    const date = new Date(normalized);
    return Number.isNaN(date.getTime()) ? "Data indisponível" : date.toLocaleString("pt-BR", {
        dateStyle: "short", timeStyle: "short", timeZone: "America/Sao_Paulo"
    });
}
function metric(label, value, accent = "") {
    return `<div class="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2.5">
        <p class="text-[11px] text-slate-400">${label}</p>
        <strong class="block text-xl font-bold tabular-nums ${accent}">${formatNumber(value)}</strong>
    </div>`;
}
function renderOverview(rows) {
    const totals = rows.reduce((sum, row) => {
        sum.cards += Number(row.count || 0);
        sum.sets += Number(row.sets_count || 0);
        sum.variants += Number(row.variants_count || 0);
        sum.missing += Number(row.variants_without_tcgplayer_id || 0);
        return sum;
    }, { cards: 0, sets: 0, variants: 0, missing: 0 });
    const coverage = totals.variants ? 100 * (totals.variants - totals.missing) / totals.variants : 0;
    return `
        <div class="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
            ${metric("Jogos", rows.length)}
            ${metric("Cartas", totals.cards)}
            ${metric("Sets", totals.sets)}
            ${metric("Variantes", totals.variants)}
            ${metric("IDs ausentes", totals.missing, "text-amber-400")}
            <div class="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2.5">
                <p class="text-[11px] text-slate-400">Cobertura IDs</p>
                <strong class="block text-xl font-bold tabular-nums">${coverage.toFixed(1).replace(".", ",")}%</strong>
                <div class="mt-1 h-1 overflow-hidden rounded-full bg-slate-800"><div class="h-full rounded-full bg-indigo-500" style="width:${coverage}%"></div></div>
            </div>
        </div>
        <section class="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
            <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 px-3 py-2">
                <h2 class="text-sm font-semibold">Catálogo por jogo</h2>
                <div class="flex items-center gap-2">
                    <input id="overviewSearch" type="search" placeholder="Buscar jogo..." aria-label="Buscar jogo" class="w-32 rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs outline-none focus:border-indigo-500 sm:w-44">
                    <select id="overviewSort" aria-label="Ordenar jogos" class="rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs">
                        <option value="cards">Mais cartas</option>
                        <option value="name">Nome</option>
                        <option value="missing">IDs ausentes</option>
                    </select>
                </div>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full min-w-[710px] text-left text-xs">
                    <thead class="bg-slate-950/70 text-[11px] text-slate-400">
                        <tr><th class="px-3 py-2 font-medium">Jogo</th><th class="px-2 py-2 text-right font-medium">Cartas</th><th class="px-2 py-2 text-right font-medium">Sets</th><th class="px-2 py-2 text-right font-medium">Variantes</th><th class="px-2 py-2 text-right font-medium">IDs ausentes</th><th class="w-32 px-2 py-2 font-medium">Cobertura</th><th class="px-2 py-2 font-medium">Preços</th><th class="px-3 py-2"></th></tr>
                    </thead>
                    <tbody id="overviewGames" class="divide-y divide-slate-800"></tbody>
                </table>
            </div>
        </section>
    `;
}
function renderGames(rows) {
    if (!rows.length) return '<tr><td colspan="8" class="p-6 text-center text-slate-400">Nenhum jogo encontrado.</td></tr>';
    return rows.map(row => {
        const variants = Number(row.variants_count || 0);
        const missing = Number(row.variants_without_tcgplayer_id || 0);
        const pct = variants ? 100 * Math.max(0, variants - missing) / variants : 0;
        const slug = encodeURIComponent(row.slug || "");
        return `<tr class="transition hover:bg-slate-800/60">
            <td class="px-3 py-2 font-medium" title="${escapeHtml(row.collection)}">${escapeHtml(row.game_name || row.slug)}</td>
            <td class="px-2 py-2 text-right tabular-nums">${formatNumber(row.count)}</td>
            <td class="px-2 py-2 text-right tabular-nums">${formatNumber(row.sets_count)}</td>
            <td class="px-2 py-2 text-right tabular-nums">${formatNumber(variants)}</td>
            <td class="px-2 py-2 text-right tabular-nums ${missing ? "text-amber-400" : "text-emerald-400"}">${formatNumber(missing)}</td>
            <td class="px-2 py-2"><div class="flex items-center gap-2"><div class="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-slate-800"><div class="h-full rounded-full bg-indigo-500" style="width:${Math.min(100, pct)}%"></div></div><span class="w-10 text-right text-[11px] tabular-nums">${pct.toFixed(1).replace(".", ",")}%</span></div></td>
            <td class="whitespace-nowrap px-2 py-2 text-[11px] text-slate-400" title="Cartas: ${escapeHtml(formatDate(row.last_cards_update))}">${row.last_prices_update ? escapeHtml(formatDate(row.last_prices_update)) : "—"}</td>
            <td class="px-3 py-2 text-right"><a href="/cards?game=${slug}" class="whitespace-nowrap text-indigo-300 hover:text-white" aria-label="Ver cartas de ${escapeHtml(row.game_name)}">Ver cartas →</a></td>
        </tr>`;
    }).join("");
}
export async function renderHomePage() {
    const app = document.querySelector("#app");
    app.innerHTML = `<div class="flex min-h-screen bg-slate-950 text-white">
        ${renderGameSidebar(null)}
        <main class="min-w-0 flex-1 p-2.5 sm:p-3 xl:p-4">
            <header class="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div><h1 class="text-xl font-bold">Visão geral</h1><p class="text-xs text-slate-400">Indicadores do catálogo</p></div>
                <div class="flex items-center gap-2">
                    <a href="/cards" class="rounded-lg border border-slate-700 px-3 py-2 text-xs hover:border-indigo-500">Cartas</a>
                    <button id="reloadOverview" class="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold hover:bg-indigo-500">Atualizar</button>
                </div>
            </header>
            <nav class="mb-3 lg:hidden"><a href="/cards" class="text-xs text-indigo-300">Explorar cartas →</a></nav>
            <div id="overviewContent" aria-live="polite" class="text-sm text-slate-400">Carregando visão geral...</div>
        </main>
    </div>`;
    let loadId = 0;
    async function load() {
        const id = ++loadId;
        const host = document.querySelector("#overviewContent");
        host.innerHTML = '<p class="py-8 text-center text-sm text-slate-400">Carregando visão geral...</p>';
        try {
            const response = await getApiInfo();
            if (id !== loadId) return;
            const rows = Array.isArray(response) ? response : Array.isArray(response?.data) ? response.data : null;
            if (!rows) throw new Error("A API não retornou uma lista de jogos.");
            host.removeAttribute("role");
            if (!rows.length) {
                host.innerHTML = '<p class="py-8 text-center text-slate-400">Nenhum jogo encontrado.</p>';
                return;
            }
            host.innerHTML = renderOverview(rows);
            const grid = host.querySelector("#overviewGames");
            const sort = host.querySelector("#overviewSort");
            const search = host.querySelector("#overviewSearch");
            function updateGrid() {
                const term = search.value.trim().toLocaleLowerCase("pt-BR");
                const list = rows.filter(row => (row.game_name || row.slug || "").toLocaleLowerCase("pt-BR").includes(term));
                if (sort.value === "name") list.sort((a,b) => (a.game_name || "").localeCompare(b.game_name || "", "pt-BR"));
                else if (sort.value === "missing") list.sort((a,b) => Number(b.variants_without_tcgplayer_id || 0) - Number(a.variants_without_tcgplayer_id || 0));
                else list.sort((a,b) => Number(b.count || 0) - Number(a.count || 0));
                grid.innerHTML = renderGames(list);
            }
            sort.addEventListener("change", updateGrid);
            search.addEventListener("input", updateGrid);
            updateGrid();
        } catch(error) {
            if (id !== loadId) return;
            host.innerHTML = `<div class="rounded-lg border border-red-900/50 bg-slate-900 p-5 text-center"><p class="text-sm text-red-400">Erro ao consultar visão geral: ${escapeHtml(error.message)}</p><button id="retryOverview" class="mt-3 rounded-lg bg-indigo-600 px-3 py-2 text-xs">Tentar novamente</button></div>`;
            host.querySelector("#retryOverview").addEventListener("click", load);
        }
    }
    app.querySelector("#reloadOverview").addEventListener("click", load);
    await load();
}
