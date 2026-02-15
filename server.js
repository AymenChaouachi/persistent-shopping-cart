process.on("uncaughtException", (err) => {
    console.error("UNCAUGHT ERROR:", err);
});

const express = require("express");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { loadDB, saveDB, cleanupExpiredCarts } = require("./storage");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Serve frontend (absolute path)
app.use(express.static(path.join(__dirname, "public")));

// Force root route to load index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Assign cart ID middleware
app.use((req, res, next) => {
    let cartId = req.headers["x-cart-id"];

    if (!cartId) {
        cartId = uuidv4();
        res.setHeader("x-cart-id", cartId);
    }

    req.cartId = cartId;
    next();
});

// Get cart
app.get("/cart", (req, res) => {
    let db = cleanupExpiredCarts(loadDB());

    if (!db[req.cartId]) {
        db[req.cartId] = { items: [], lastUpdated: Date.now() };
    }

    saveDB(db);
    res.json({ cartId: req.cartId, items: db[req.cartId].items });
});

// Add item
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

// Remove item
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

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
