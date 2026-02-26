export async function notFound(req,res,next) {
    const error = new Error("Aucune route trouvée");
    error.statusCode = 404;
    next(error);
}