import fs from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const gamesPath = join(__dirname,"..","data","games.json");


export async function readAllGames() {
    const data = await fs.readFile(gamesPath, "utf-8");
    return JSON.parse(data);
}

export async function readGameById(id) {
    const games = await readAllGames();
    return games.find(game => game.id === parseInt(id));
}

export async function createGame(newGame) {
    const games = await readAllGames();
    
    // Générer un nouvel ID
    const newId = Math.max(...games.map(g => g.id)) + 1;
    
    const gameToAdd = {
        id: newId,
        ...newGame
    };
    
    games.push(gameToAdd);
    
    // Sauvegarder dans le fichier
    await fs.writeFile(gamesPath, JSON.stringify(games, null, 2));
    
    return gameToAdd;
}