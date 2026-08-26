function buildUrl(path) {
    // Desenvolvimento local:
    // usa o proxy configurado no vite.config.js
    if (import.meta.env.DEV) {
        return `/homura-api${path}`;
    }

    // Produção na Vercel:
    // usa nossa Function /api/proxy
    return `/api/proxy?path=${encodeURIComponent(
        path.replace(/^\//, "")
    )}`;
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


export async function getApiInfo() {
    return request("/");
}


export async function getCards(
    game,
    params = {}
) {
    const searchParams =
        new URLSearchParams();

    Object.entries(params).forEach(
        ([key, value]) => {
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
        }
    );

    const query =
        searchParams.toString();

    return request(
        `/api/${game}/cards${
            query ? `?${query}` : ""
        }`
    );
}


export async function getCardById(
    game,
    cardId
) {
    return request(
        `/api/${game}/cards/${encodeURIComponent(cardId)}`
    );
}


export async function lookupCard(
    game,
    query
) {
    return request(
        `/api/${game}/cards/lookup?q=${encodeURIComponent(query)}`
    );
}


export async function getRandomCard(game) {
    return request(
        `/api/${game}/cards/random`
    );
}


export async function getCardsBulk(
    game,
    ids
) {
    return request(
        `/api/${game}/cards/bulk`,
        {
            method: "POST",

            headers: {
                "Content-Type":
                    "application/json",
            },

            body: JSON.stringify({
                ids,
            }),
        }
    );
}