const HOMURA_API =
    "https://homura-cards.vercel.app";


export default async function handler(req, res) {
    const rawPath = req.query.path;

    if (!rawPath) {
        return res.status(400).json({
            error: "Path obrigatório",
        });
    }

    try {
        const decodedPath =
            decodeURIComponent(rawPath);

        const url =
            `${HOMURA_API}/${decodedPath}`;

        const options = {
            method: req.method,

            headers: {
                Authorization:
                    `Bearer ${process.env.HOMURA_API_TOKEN}`,
            },
        };

        if (
            req.method !== "GET" &&
            req.method !== "HEAD"
        ) {
            options.headers[
                "Content-Type"
            ] = "application/json";

            options.body =
                JSON.stringify(req.body);
        }

        const response =
            await fetch(url, options);

        const contentType =
            response.headers.get(
                "content-type"
            );

        let data;

        if (
            contentType?.includes(
                "application/json"
            )
        ) {
            data =
                await response.json();
        } else {
            data =
                await response.text();
        }

        if (
            typeof data === "string"
        ) {
            return res
                .status(response.status)
                .send(data);
        }

        return res
            .status(response.status)
            .json(data);

    } catch (error) {
        console.error(
            "Erro proxy Homura:",
            error
        );

        return res.status(500).json({
            error:
                "Erro ao consultar Homura API",
        });
    }
}