const HOMURA_API = "https://homura-cards.vercel.app";

export default async function handler(req, res) {
    const {
        game,
        page = "1",
        limit = "24",
    } = req.query;

    if (!game) {
        return res.status(400).json({
            error: "O parâmetro game é obrigatório",
        });
    }

    try {
        const url =
            `${HOMURA_API}/api/${game}/cards` +
            `?page=${page}&limit=${limit}`;

        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${process.env.HOMURA_API_TOKEN}`,
            },
        });

        const data = await response.json();

        return res
            .status(response.status)
            .json(data);

    } catch (error) {
        console.error("Erro Homura API:", error);

        return res.status(500).json({
            error: "Erro ao consultar a Homura API",
        });
    }
}