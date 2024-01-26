import express from "express";

const port = process.env.PORT || 3000;

const app = express();

// Accpect json data
app.use(express.json());

app.get("/", (req, res) => {
    res.json('Welcome to the Meta-Shops');
});

app.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
});