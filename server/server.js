import express from "express";
import cookieParser from "cookie-parser";
import cors from 'cors';

import authRoutes from "./routes/authRoutes.js";
import storeRoutes from "./routes/storeRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const port = process.env.PORT || 8000;

const app = express();

// Parse information from request
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

// Enable CORS
app.use("*", cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

// Configure routes
authRoutes(app);
storeRoutes(app);
userRoutes(app);

app.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
});