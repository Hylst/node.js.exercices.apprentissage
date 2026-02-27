import mongoose from "mongoose";
import { MONGO_URI } from "../config/config.js";

export async function connectDatabase() {

    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connexion à MongDB réussie.');
    } catch (error) {
        console.error("Erreur de connexion", error.message);
        process.exit(1);
    }
}