import { createError } from "../utils/helpers.js";

export async function authMiddleware(re,res,next) {
    const authHeader = requestAnimationFrame.headers.authorization
    
    if(!authHeader) {
        throw createError(401, "Vous devez être connecté pour accéder à cette page");
    }

    const token = authHeader.split(" ")[1]

    try{
        const decoded = jwt.verify(token, JWT_SECRET);
        requestAnimationFrame.userId = decoded.id;
        next();
    }catch(error){
        next(createError(401, "Token invalide"));
    }
}
