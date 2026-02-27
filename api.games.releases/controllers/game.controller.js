import { getAllGames, getGameById, createNewGame } from "../services/game.service.js";

export async function showAllGames(req,res,next){
    try{
        const games = await getAllGames();

        res.status(200).json({
            message : "Voici la liste des jeux",
            liste: games
        })
    }catch(error){
        next(error)
    }
}

export async function showGameById(req, res, next) {
    try {
        const { id } = req.params;
        const game = await getGameById(id);

        res.status(200).json({
            message: "Jeu trouvé",
            game: game
        });
    } catch (error) {
        next(error);
    }
}

export async function createGame(req, res, next) {
    try {
        const gameData = req.body;
        const newGame = await createNewGame(gameData);

        res.status(201).json({
            message: "Jeu créé avec succès",
            game: newGame
        });
    } catch (error) {
        next(error);
    }
}