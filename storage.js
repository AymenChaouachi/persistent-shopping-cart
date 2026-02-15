const fs = require("fs");

const DB_FILE = "carts.json";
const CART_EXPIRY_DAYS = 7;

function loadDB() {
    if (!fs.existsSync(DB_FILE)) return {};
    return JSON.parse(fs.readFileSync(DB_FILE));
}

function saveDB(db) {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

function cleanupExpiredCarts(db) {
    const now = Date.now();
    const expiryMs = CART_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

    for (const id in db) {
        if (now - db[id].lastUpdated > expiryMs) {
            delete db[id];
        }
    }
    return db;
}

module.exports = { loadDB, saveDB, cleanupExpiredCarts };
