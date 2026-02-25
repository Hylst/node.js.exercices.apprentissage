// ==================== MIDDLEWARES ====================

// Middleware pour valider que l'ID est un nombre
export const validateId = (req, res, next) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ message: "L'ID doit être un chiffre" });
    }
    req.id = id;
    next();
};

// Middleware pour valider que le body n'est pas vide
export const validateData = (req, res, next) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: "Aucune donnée fournie." });
    }
    next();
};

// Middleware pour gérer les réponses avec messages d'erreur
export const handleResult = (req, res, result, entityType = "Entité") => {
    if (result.message) {
        if (result.message.includes("introuvable")) {
            return res.status(404).json(result);
        }
        return res.status(400).json(result);
    }
    return result;
};

// Middleware centralisé de gestion d'erreurs
export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    
    // Erreur de fichier non trouvé
    if (err.code === 'ENOENT') {
        return res.status(404).json({ 
            message: "Fichier de données non trouvé" 
        });
    }
    
    // Erreur de syntaxe JSON
    if (err instanceof SyntaxError) {
        return res.status(400).json({ 
            message: "Erreur de format JSON dans les données" 
        });
    }
    
    // Erreur générique
    res.status(500).json({ 
        message: "Erreur serveur interne",
        error: err.message 
    });
};
