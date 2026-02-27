import { NOD_ENV } from "../config/config.js";


export async function errorHandler(error,req,res,next) {

    if(NOD_ENV==="development") {
        console.error(error);
    }
    const statusCode = error.statusCode || 500;
    const message = error.message || "Erreur serveur interne"

    res.status(statusCode).json ({
        erreur:message,
        statusCode:statusCode
    });
}