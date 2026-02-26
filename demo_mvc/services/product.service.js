import { readAllProducts } from "../models/product.model.js";


export async function getAllProducts() {
    const products = await readAllProducts();

    console.log(products);
    

    if(products.length == 0){
        const error = new Error("Aucun produit trouvé!");
        error.statusCode= 404;
        throw error
    }

    return products
}

