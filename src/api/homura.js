function buildUrl(path) {
    // Desenvolvimento local:
    // vite.config.js encaminha /homura-api para a Homura
    if (import.meta.env.DEV) {
        return `/homura-api${path}`;
    }

    // Produção:
    // passa pela Vercel Function para proteger o token
    const cleanPath = path.replace(/^\/+/, "");

    return `/api/homura?path=${encodeURIComponent(cleanPath)}`;
}


async function request(path, options = {}) {
    const response = await fetch(
        buildUrl(path),
        options
    );

    let data;

    try {
        data = await response.json();
    } catch {
        throw new Error(
            `Resposta inválida da API (${response.status})`
        );
    }

    if (!response.ok) {
        throw new Error(
            data?.detail ||
            data?.message ||
            data?.error ||
            `Erro HTTP ${response.status}`
        );
    }

    return data;
}


export function getApiInfo() {
    return request("/");
}


export function getCards(game, params = {}) {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (
            value !== undefined &&
            value !== null &&
            value !== ""
        ) {
            searchParams.set(
                key,
                String(value)
            );
        }
    });

    const query = searchParams.toString();

    return request(
        `/api/${game}/cards${query ? `?${query}` : ""}`
    );
}


export function getCardById(game, cardId) {
    return request(
        `/api/${game}/cards/${encodeURIComponent(cardId)}`
    );
}


export function lookupCard(game, query) {
    return request(
        `/api/${game}/cards/lookup?q=${encodeURIComponent(query)}`
    );
}


export function getRandomCard(game) {
    return request(
        `/api/${game}/cards/random`
    );
}

export function getRandomCardV2(game) {
    return request(
        `/api/${game}/cards/random/v2`
    );
}

export function getCardsBulk(game, ids) {
    return request(
        `/api/${game}/cards/bulk`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                ids,
            }),
        }
    );
}