import { getApiInfo } from "../api/homura.js";
import { escapeHtml } from "../utils/helpers.js";
import { renderAppLayout, bindAppLayoutNavigation } from "../components/app-layout.js";

const formatNumber = value => Number(value || 0).toLocaleString("pt-BR");
function formatDate(value) {
    if (!value) return "Sem atualização";
    const normalized = /(?:Z|[+-]\d\d:\d\d)$/.test(value) ? value : value + "Z";
    const date = new Date(normalized);
    return Number.isNaN(date.getTime()) ? "Data indisponível" : date.toLocaleString("pt-BR", {
        dateStyle: "short", timeStyle: "short", timeZone: "America/Sao_Paulo"
    });
}
function metric(label, value, note = "") {
    return `<div class="rounded-lg border border-slate-800 bg-slate-900 p-3">
        <p class="text-xs text-slate-400">${label}</p>
        <strong class="mt-1 block text-xl font-bold tabular-nums">${formatNumber(value)}</strong>
        ${note ? `<p class="mt-1 text-xs text-slate-500">${note}</p>` : ""}
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
        <div class="mb-3 grid grid-cols-2 gap-2 lg:grid-cols-3 2xl:grid-cols-6">
            ${metric("Jogos", rows.length)}
            ${metric("Cartas", totals.cards)}
            ${metric("Sets", totals.sets)}
            ${metric("Variantes", totals.variants)}
            ${metric("Sem TCGplayer ID", totals.missing)}
            <div class="rounded-lg border border-slate-800 bg-slate-900 p-3">
                <p class="text-xs text-slate-400">Cobertura de IDs</p>
                <strong class="mt-1 block text-xl font-bold tabular-nums">${coverage.toFixed(1).replace(".", ",")}%</strong>
                <p class="mt-1 text-xs text-slate-500">Variantes com ID preenchido</p>
            </div>
        </div>
        <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 class="text-base font-semibold">Jogos cadastrados</h2>
            <div class="flex items-center gap-2">
                <label for="overviewSort" class="text-xs text-slate-400">Ordenar por</label>
                <select id="overviewSort" class="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5 text-xs">
                    <option value="cards">Mais cartas</option>
                    <option value="name">Nome</option>
                    <option value="missing">Mais IDs ausentes</option>
                </select>
            </div>
        </div>
        <div id="overviewGames" class="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"></div>
    `;
}
function renderGames(rows) {
    return rows.map(row => {
        const cards = Number(row.count || 0);
        const withVariants = Number(row.cards_with_variants || 0);
        const variants = Number(row.variants_count || 0);
        const missing = Number(row.variants_without_tcgplayer_id || 0);
        const pct = variants ? ((variants - missing) / variants * 100) : 0;
        const cardPct = cards ? withVariants / cards * 100 : 0;
        const slug = encodeURIComponent(row.slug || "");
        return `<article class="min-w-0 rounded-lg border border-slate-800 bg-slate-900 p-3 transition hover:border-indigo-500/60">
            <div class="mb-3 flex items-start justify-between gap-2">
                <div class="min-w-0">
                    <h3 class="truncate text-sm font-semibold" title="${escapeHtml(row.game_name)}">${escapeHtml(row.game_name)}</h3>
                    <p class="mt-0.5 truncate text-[11px] text-slate-500">${escapeHtml(row.collection)}</p>
                </div>
                <a href="/cards?game=${slug}" class="shrink-0 rounded-md bg-indigo-600 px-2.5 py-1.5 text-xs font-semibold hover:bg-indigo-500">Cartas →</a>
            </div>
            <dl class="grid grid-cols-2 gap-x-3 gap-y-2">
                <div><dt class="text-[11px] text-slate-400">Cartas</dt><dd class="text-base font-semibold tabular-nums">${formatNumber(cards)}</dd></div>
                <div><dt class="text-[11px] text-slate-400">Sets</dt><dd class="text-base font-semibold tabular-nums">${formatNumber(row.sets_count)}</dd></div>
                <div><dt class="text-[11px] text-slate-400">Variantes</dt><dd class="text-base font-semibold tabular-nums">${formatNumber(variants)}</dd></div>
                <div><dt class="text-[11px] text-slate-400">Sem TCGplayer ID</dt><dd class="text-base font-semibold tabular-nums ${missing ? "text-amber-400" : "text-emerald-400"}">${formatNumber(missing)}</dd></div>
            </dl>
            <div class="mt-3">
                <div class="mb-1 flex justify-between gap-2 text-[11px] text-slate-400"><span>Cobertura de IDs</span><span>${pct.toFixed(1).replace(".", ",")}%</span></div>
                <div class="h-1.5 overflow-hidden rounded-full bg-slate-800"><div class="h-full rounded-full bg-indigo-500" style="width:${Math.max(0, Math.min(100, pct))}%"></div></div>
                <p class="mt-1 text-[11px] text-slate-500">Cartas com variantes: ${formatNumber(withVariants)} (${cardPct.toFixed(1).replace(".", ",")}%)</p>
            </div>
            <div class="mt-3 border-t border-slate-800 pt-2 text-[11px] text-slate-400">
                <p>Cartas: ${formatDate(row.last_cards_update)}</p>
                <p class="mt-1">Preços: ${formatDate(row.last_prices_update)}</p>
            </div>
        </article>`;
    }).join("");
}
export async function renderHomePage() {
    const app = document.querySelector("#app");
    app.innerHTML = renderAppLayout(`
        <header class="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div><h1 class="text-xl font-bold">Visão geral</h1><p class="text-xs text-slate-400">Indicadores do catálogo</p></div>
            <div class="flex gap-2">
                <a href="/cards" class="rounded-lg border border-slate-700 px-3 py-2 text-xs hover:border-indigo-500">Cartas</a>
                <button id="reloadOverview" class="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold hover:bg-indigo-500">Atualizar</button>
            </div>
        </header>
        <div id="overviewContent" aria-live="polite" class="text-sm text-slate-400">Carregando visão geral...</div>
    `, null);
    bindAppLayoutNavigation();
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
            function updateGrid() {
                const list = [...rows];
                if (sort.value === "name") list.sort((a,b) => (a.game_name || "").localeCompare(b.game_name || "", "pt-BR"));
                else if (sort.value === "missing") list.sort((a,b) => Number(b.variants_without_tcgplayer_id || 0) - Number(a.variants_without_tcgplayer_id || 0));
                else list.sort((a,b) => Number(b.count || 0) - Number(a.count || 0));
                grid.innerHTML = renderGames(list);
            }
            sort.addEventListener("change", updateGrid);
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
