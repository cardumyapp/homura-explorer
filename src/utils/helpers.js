export function getImage(card) {
    return (
        card?.images?.large ||
        card?.images?.small ||
        card?.image ||
        card?.image_url ||
        ""
    );
}

export function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
    })[char]);
}