import { defineConfig, loadEnv } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");

    console.log(
        "Token carregado:",
        env.HOMURA_API_TOKEN
            ? `${env.HOMURA_API_TOKEN.slice(0, 4)}...`
            : "NÃO ENCONTRADO"
    );

    return {
        plugins: [
            tailwindcss(),
        ],

        server: {
            proxy: {
                "/homura-api": {
                    target: "https://homura-cards.vercel.app",
                    changeOrigin: true,

                    rewrite: (path) =>
                        path.replace(/^\/homura-api/, ""),

                    configure: (proxy) => {
                        proxy.on("proxyReq", (proxyReq) => {
                            proxyReq.setHeader(
                                "Authorization",
                                `Bearer ${env.HOMURA_API_TOKEN}`
                            );
                        });
                    },
                },
            },
        },
    };
});