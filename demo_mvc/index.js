import express from "express";
import productsRoutes from "./routes/product.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFound } from "./middlewares/notFound.js";

const app = express();
const PORT = 3000;

app.use('/products', productsRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT,()=>{
    console.log(`Serveur démarré sur le port ${PORT}`);
})