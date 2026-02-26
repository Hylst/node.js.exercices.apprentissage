import { showAllProducts } from "../controllers/product.controller.js";
import { Router } from "express";

const router = Router();

router.get('/', showAllProducts);


export default router;