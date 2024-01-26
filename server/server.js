import express from "express";

import dbPool from "./database/db.js";

const port = process.env.PORT || 3000;

const app = express();

// Accpect json data
app.use(express.json());

app.get("/", (req, res) => {
    res.json('Welcome to the Meta-Shops');
});

app.get("/users", async (req, res) => {
    try {
        const { rows } = await dbPool.query('SELECT * FROM public."User"');
        res.json(rows);
    } catch (err) {
        res.status(500).json(err);
    }
});

app.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
});