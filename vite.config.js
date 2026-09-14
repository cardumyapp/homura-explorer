import { defineConfig, loadEnv } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");

    return {
        plugins: [
            tailwindcss(),

            VitePWA({
                registerType: "autoUpdate",

                includeAssets: [
                    "favicon.ico",
                    "favicon.svg",
                    "apple-touch-icon.png",
                ],

                manifest: {
                    name: "Homura Explorer",
                    short_name: "HomuraExp",

                    description:
                        "Explorador de cartas TCG",

                    start_url: "/",

                    display: "standalone",

                    theme_color: "#0f172a",
                    background_color: "#020617",

                    icons: [
                        {
                            src: "/web-app-manifest-192x192.png",
                            sizes: "192x192",
                            type: "image/png",
                        },
                        {
                            src: "/web-app-manifest-512x512.png",
                            sizes: "512x512",
                            type: "image/png",
                        },
                        {
                            src: "/web-app-manifest-512x512.png",
                            sizes: "512x512",
                            type: "image/png",
                            purpose: "maskable",
                        },
                    ],
                },
            }),
        ],

        server: {
            proxy: {
                "/homura-api": {
                    target:
                        "https://homura-cards.vercel.app",

                    changeOrigin: true,

                    rewrite: (path) =>
                        path.replace(
                            /^\/homura-api/,
                            ""
                        ),

                    configure: (proxy) => {
                        proxy.on(
                            "proxyReq",
                            (proxyReq) => {
                                proxyReq.setHeader(
                                    "Authorization",
                                    `Bearer ${env.HOMURA_API_TOKEN}`
                                );
                            }
                        );
                    },
                },
            },
        },
    };
});