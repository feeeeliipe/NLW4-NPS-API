import "reflect-metadata"; // Must be the first import
import express from "express";
import createConnection from "./database";
import routes from "./routes";
import dotenv from "dotenv";
dotenv.config();

createConnection();
const app = express();

// Middlewares
app.use(express.json());

// Rotas
app.use(routes);

export { app };
