import { getAllProducts } from "../services/product.service.js";

export async function showAllProducts(req,res,next){
    try{
        const products = await getAllProducts();

        res.status(200).json({
            message : "Voici la liste des produits",
            liste: products
        })
    }catch(error){
        next(error)
    }
}