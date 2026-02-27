import { Router } from "express";
import * as userController from "../controllers/user.controller.js"

const router = Router();

router.get('/',authMiddleware,userController.getAllUsers);
router.get('/:id',userController.getUserById);
router.post('/',userController.createUser);
router.put('/:id',userController.updateUser);
router.delete('/:id',userController.deleteUser);
router.post('/login',userController.login);

export default router;
