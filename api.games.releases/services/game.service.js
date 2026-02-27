import { readAllGames, readGameById, createGame } from "../models/game.model.js";


export async function getAllGames() {
    const games = await readAllGames();

    console.log(games);
    

    if(games.length == 0){
        const error = new Error("Aucun jeu trouvé!");
        error.statusCode= 404;
        throw error
    }

    return games
}

export async function getGameById(id) {
    // Validation de l'ID
    if (!id || isNaN(parseInt(id))) {
        const error = new Error("ID invalide");
        error.statusCode = 422;  // Unprocessable Entity
        throw error;
    }

    const game = await readGameById(id);

    if (!game) {
        const error = new Error(`Jeu avec l'ID ${id} non trouvé`);
        error.statusCode = 404;  // Not Found
        throw error;
    }

    return game;
}

export async function createNewGame(gameData) {

    // 1. Vérification des champs obligatoires
    const requiredFields = ['title', 'studio', 'platform', 'releaseDate', 'price'];
    const missingFields = requiredFields.filter(field => !gameData[field]);

    if (missingFields.length > 0) {
        const error = new Error(`Champs manquants: ${missingFields.join(', ')}`);
        error.statusCode = 400;  // Bad Request
        throw error;
    }

    // 2. Validation du prix
    if (gameData.price <= 0) {
        const error = new Error("Le prix doit être supérieur à 0");
        error.statusCode = 422;  // Unprocessable Entity
        throw error;
    }

    // 3. Validation de la date
    const releaseDate = new Date(gameData.releaseDate);
    if (isNaN(releaseDate.getTime())) {
        const error = new Error("La date de sortie doit être une date valide");
        error.statusCode = 422;  // Unprocessable Entity
        throw error;
    }

    // 4. Vérification des doublons (title + platform)
    const existingGames = await readAllGames();
    const duplicate = existingGames.find(game => 
        game.title.toLowerCase() === gameData.title.toLowerCase() && 
        game.platform.toLowerCase() === gameData.platform.toLowerCase()
    );
    
    if (duplicate) {
        const error = new Error(`Un jeu avec le titre "${gameData.title}" sur la plateforme "${gameData.platform}" existe déjà`);
        error.statusCode = 409;  // Conflict
        throw error;
    }




    return await createGame(gameData);
}