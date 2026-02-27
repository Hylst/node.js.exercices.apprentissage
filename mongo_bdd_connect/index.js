import express from "express";
import { connectDatabase } from "./config/database.js";
import userRoutes from "./routes/user.route.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFound } from "./middlewares/notFound.js";
import { PORT } from "./config/config.js";

const app = express()

await connectDatabase();

// Middleware pour parser le JSON
app.use(express.json());

app.get("/", (req,res) => {
    res.send("Bienvenue sur mon API de connection à ma BDD Mongo !");
});

app.use('/users', userRoutes)


app.use(notFound);
app.use(errorHandler);

app.listen(PORT, ()=> {
    console.log(`Serveur démarré sur le port ${PORT}`);
});

