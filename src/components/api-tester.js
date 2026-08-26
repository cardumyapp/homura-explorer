export function renderApiTester() {
    return `
        <section
            class="
                mt-10
                rounded-xl
                border
                border-slate-800
                bg-slate-900
                p-5
            "
        >

            <div class="mb-5">

                <h3 class="text-lg font-bold">
                    API Tester
                </h3>

                <p
                    class="mt-1 text-sm text-slate-500"
                >
                    Teste manual dos endpoints da Homura
                </p>

            </div>

            <div
                class="
                    grid
                    gap-3
                    md:grid-cols-2
                "
            >

                <button
                    data-api-test="info"
                    class="api-test-button"
                >
                    GET /
                </button>

                <button
                    data-api-test="random"
                    class="api-test-button"
                >
                    Carta aleatória
                </button>

            </div>


            <div
                class="
                    mt-5
                    grid
                    gap-4
                    md:grid-cols-2
                "
            >

                <div>

                    <label
                        class="mb-1 block text-xs text-slate-400"
                    >
                        Buscar por ID
                    </label>

                    <div class="flex gap-2">

                        <input
                            id="testerCardId"
                            type="text"
                            placeholder="OP01-001"
                            class="tester-input"
                        >

                        <button
                            data-api-test="id"
                            class="api-test-button"
                        >
                            Testar
                        </button>

                    </div>

                </div>


                <div>

                    <label
                        class="mb-1 block text-xs text-slate-400"
                    >
                        Lookup
                    </label>

                    <div class="flex gap-2">

                        <input
                            id="testerLookup"
                            type="text"
                            placeholder="Luffy"
                            class="tester-input"
                        >

                        <button
                            data-api-test="lookup"
                            class="api-test-button"
                        >
                            Testar
                        </button>

                    </div>

                </div>

            </div>


            <div class="mt-5">

                <label
                    class="mb-1 block text-xs text-slate-400"
                >
                    Bulk — um ID por linha
                </label>

                <textarea
                    id="testerBulk"
                    rows="4"
                    placeholder="OP01-001&#10;OP01-002&#10;OP01-003"
                    class="
                        w-full
                        rounded-lg
                        border
                        border-slate-700
                        bg-slate-950
                        p-3
                        text-sm
                        outline-none
                        focus:border-indigo-500
                    "
                ></textarea>

                <button
                    data-api-test="bulk"
                    class="
                        mt-2
                        rounded-lg
                        bg-indigo-600
                        px-4
                        py-2
                        text-sm
                        font-bold
                    "
                >
                    Testar bulk
                </button>

            </div>


            <div class="mt-6">

                <div
                    class="
                        mb-2
                        flex
                        items-center
                        justify-between
                    "
                >

                    <span
                        class="text-xs text-slate-400"
                    >
                        Resposta
                    </span>

                    <button
                        id="clearTesterBtn"
                        class="
                            text-xs
                            text-slate-500
                            hover:text-white
                        "
                    >
                        Limpar
                    </button>

                </div>

                <pre
                    id="testerResult"
                    class="
                        max-h-[500px]
                        overflow-auto
                        rounded-lg
                        bg-black
                        p-4
                        text-xs
                        text-slate-300
                    "
                >Selecione um endpoint.</pre>

            </div>

        </section>
    `;
}