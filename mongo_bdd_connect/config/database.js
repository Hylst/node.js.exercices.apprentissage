import mongoose from "mongoose";

export async function connectDatabase() {

    try {
        await mongoose.connect('mongodb://localhost:27017/nodejsexos');
        console.log('Connexion à MongDB réussie.');
    } catch (error) {
        console.error("Erreur de connexion", error.message);
        process.exit(1);
    }
}