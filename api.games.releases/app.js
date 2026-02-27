import express from "express";
import gamesRoutes from "./routes/game.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFound } from "./middlewares/notFound.js";

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/games', gamesRoutes);

// Route de base
app.get("/", (req, res) => {
    res.json({ message: "API Games Releases is running!" });
});

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
