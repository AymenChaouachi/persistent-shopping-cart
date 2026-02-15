const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { loadDB, saveDB, cleanupExpiredCarts } = require("./storage");

const app = express();
const PORT = 3000;

app.use(express.json());


app.use((req, res, next) => {
    let cartId = req.headers["x-cart-id"];

    if (!cartId) {
        cartId = uuidv4();
        res.setHeader("x-cart-id", cartId);
    }

    req.cartId = cartId;
    next();
});

app.get("/cart", (req, res) => {
    let db = cleanupExpiredCarts(loadDB());

    if (!db[req.cartId]) {
        db[req.cartId] = { items: [], lastUpdated: Date.now() };
    }

    saveDB(db);
    res.json({ cartId: req.cartId, items: db[req.cartId].items });
});

app.post("/cart", (req, res) => {
    const { product, quantity } = req.body;

    let db = cleanupExpiredCarts(loadDB());

    if (!db[req.cartId]) {
        db[req.cartId] = { items: [], lastUpdated: Date.now() };
    }

    const cart = db[req.cartId];
    const existing = cart.items.find(i => i.product === product);

    if (existing) {
        existing.quantity += Number(quantity);
    } else {
        cart.items.push({ product, quantity: Number(quantity) });
    }

    cart.lastUpdated = Date.now();
    saveDB(db);

    res.json(cart);
});

app.delete("/cart/:product", (req, res) => {
    let db = cleanupExpiredCarts(loadDB());

    if (!db[req.cartId]) return res.json({ items: [] });

    db[req.cartId].items = db[req.cartId].items.filter(
        i => i.product !== req.params.product
    );

    db[req.cartId].lastUpdated = Date.now();
    saveDB(db);

    res.json(db[req.cartId]);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
