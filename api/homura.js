const HOMURA_API = "https://homura-cards.vercel.app";

export default async function handler(req, res) {
    const rawPath = req.query.path;

    if (!rawPath) {
        return res.status(400).json({
            error: "Path obrigatório",
        });
    }

    const token = process.env.HOMURA_API_TOKEN;

    if (!token) {
        console.error("HOMURA_API_TOKEN não configurado");

        return res.status(500).json({
            error: "Token da Homura não configurado",
        });
    }

    try {
        // Garante que não começamos com /
        const path = String(rawPath).replace(/^\/+/, "");

        const url = `${HOMURA_API}/${path}`;

        const headers = {
            Authorization: `Bearer ${token}`,
        };

        const options = {
            method: req.method,
            headers,
        };

        // GET e HEAD não possuem body
        if (
            req.method !== "GET" &&
            req.method !== "HEAD"
        ) {
            headers["Content-Type"] = "application/json";

            options.body =
                typeof req.body === "string"
                    ? req.body
                    : JSON.stringify(req.body ?? {});
        }

        const response = await fetch(url, options);

        const contentType =
            response.headers.get("content-type") || "";

        if (contentType.includes("application/json")) {
            const data = await response.json();

            return res
                .status(response.status)
                .json(data);
        }

        const data = await response.text();

        return res
            .status(response.status)
            .send(data);

    } catch (error) {
        console.error("Erro ao consultar Homura:", error);

        return res.status(500).json({
            error: "Erro ao consultar Homura API",
        });
    }
}