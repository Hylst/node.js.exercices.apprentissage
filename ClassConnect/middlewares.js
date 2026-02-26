// ==================== MIDDLEWARES ====================

import { ERROR_MESSAGES, ValidationError, NotFoundError, AppError } from "./errors.js";

// Wrapper pour les routes async - attrape les erreurs et les passe à errorHandler
export const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

// Middleware pour valider que l'ID est un nombre
export const validateId = (req, res, next) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ message: ERROR_MESSAGES.INVALID_ID });
    }
    req.id = id;
    next();
};

// Middleware pour valider que le body n'est pas vide
export const validateData = (req, res, next) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: ERROR_MESSAGES.NO_DATA_PROVIDED });
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
    
    // Erreur personnalisée (AppError)
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ 
            message: err.message 
        });
    }
    
    // Erreur de fichier non trouvé
    if (err.code === 'ENOENT') {
        return res.status(404).json({ 
            message: ERROR_MESSAGES.FILE_NOT_FOUND
        });
    }
    
    // Erreur de syntaxe JSON
    if (err instanceof SyntaxError) {
        return res.status(400).json({ 
            message: ERROR_MESSAGES.JSON_FORMAT_ERROR
        });
    }
    
    // Erreur générique
    res.status(500).json({ 
        message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
};
