export const games = [
    {
        id: "altered",
        name: "Altered",
        filters: [
            "id",
            "name",
            "set",
        ],
    },
    {
        id: "cardfight-vanguard",
        name: "Cardfight Vanguard",
        filters: [
            "id",
            "name",
            "set",
        ],
    },
    {
        id: "cyberpunk",
        name: "Cyberpunk",
        filters: [
            "id",
            "name",
            "set",
        ],
    },
    {
        id: "digimon",
        name: "Digimon",
        filters: [
            "id",
            "code",
            "name",
            "rarity",
            "type",
            "color",
            "set",
        ],
    },
    {
        id: "dragon-ball-fusion",
        name: "Dragon Ball Fusion World",
        filters: [
            "id",
            "code",
            "name",
            "rarity",
            "type",
            "color",
            "cost",
            "power",
            "characterTraits",
            "set",
        ],
    },
    {
        id: "fab",
        name: "Flesh and Blood",
        filters: [
            "name",
            "set",
        ],
    },
    {
        id: "grand-archive",
        name: "Grand Archive",
        filters: [
            "id",
            "name",
            "set",
        ],
    },
    {
        id: "hololive",
        name: "Hololive",
        filters: [
            "id",
            "name",
            "set",
        ],
    },
    {
        id: "godzilla",
        name: "Godzilla",
        filters: [
            "id",
            "name",
            "set",
        ],
    },
    {
        id: "gundam",
        name: "Gundam",
        filters: [
            "id",
            "code",
            "name",
            "rarity",
        ],
    },
    {
        id: "lorcana",
        name: "Disney Lorcana",
        filters: [
            "id",
            "name",
            "set",
        ],
    },
    {
        id: "one-piece",
        name: "One Piece",
        filters: [
            "id",
            "code",
            "name",
            "rarity",
            "type",
            "color",
            "cost",
            "power",
            "family",
            "set",
        ],
    },
    {
        id: "pokemon",
        name: "Pokémon",
        filters: [
            "id",
            "code",
            "name",
            "rarity",
            "type",
            "set",
            "card_type",
            "stage",
            "artist",
        ],
    },
    {
        id: "riftbound",
        name: "Riftbound",
        filters: [
            "name",
            "rarity",
            "might",
            "energyCost",
            "powerCost",
            "cardType",
            "domain",
            "set",
        ],
    },
    {
        id: "sorcery",
        name: "Sorcery",
        filters: [
            "name",
            "type",
            "rarity",
            "element",
            "subtype",
            "set",
            "finish",
            "product",
            "artist",
        ],
    },
    {
        id: "star-wars",
        name: "Star Wars Unlimited",
        filters: [
            "name",
            "set",
        ],
    },
    {
        id: "union-arena",
        name: "Union Arena",
        filters: [
            "id",
            "code",
            "name",
            "rarity",
        ],
    },
    {
        id: "universus",
        name: "UniVersus",
        filters: [
            "id",
            "name",
            "set",
        ],
    },
    {
        id: "yugioh",
        name: "Yu-Gi-Oh!",
        filters: [
            "id",
            "konami_id",
            "effect",
            "name",
            "attribute",
            "type",
            "frameType",
            "set",
            "rarity",
        ],
    }
];

export function getGame(gameId) {
    return games.find((game) => game.id === gameId);
}