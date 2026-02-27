export async function errorHandler(error, req, res, next) {
    console.error(error);

    const statusCode = error.statusCode || 500;
    const message = error.message || "Erreur serveur interne";

    res.status(statusCode).json({
        erreur: message
    })
}