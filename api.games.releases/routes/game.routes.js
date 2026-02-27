import { showAllGames, showGameById, createGame } from "../controllers/game.controller.js";
import { Router } from "express";

const router = Router();

router.get('/', showAllGames);

// GET /api/games/1
router.get('/:id', showGameById);
// POST /api/games
router.post('/', createGame);

export default router;