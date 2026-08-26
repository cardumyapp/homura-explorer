import "./style.css";

import {
    renderCardsPage,
} from "./pages/cards-page.js";

import {
    renderApiTesterPage,
} from "./pages/api-tester-page.js";

const path =
    window.location.pathname;

if (path === "/api-tester") {
    renderApiTesterPage();
} else {
    renderCardsPage();
}