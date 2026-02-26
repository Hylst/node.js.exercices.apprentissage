// ==================== MESSAGES D'ERREUR ====================

export const ERROR_MESSAGES = {
    // Validation errors
    INVALID_ID: "L'ID doit être un chiffre",
    NO_DATA_PROVIDED: "Aucune donnée fournie",
    
    // Resource errors
    USER_NOT_FOUND: "Utilisateur introuvable",
    POST_NOT_FOUND: "Post introuvable",
    RESOURCE_NOT_FOUND: "Ressource introuvable",
    
    // File errors
    FILE_NOT_FOUND: "Fichier de données non trouvé",
    JSON_FORMAT_ERROR: "Erreur de format JSON dans les données",
    FILE_READ_ERROR: "Erreur lors de la lecture du fichier",
    FILE_WRITE_ERROR: "Erreur lors de l'écriture du fichier",
    
    // Operation errors
    USER_ADD_ERROR: "Erreur lors de l'ajout de l'utilisateur",
    POST_ADD_ERROR: "Erreur lors de l'ajout du post",
    USER_UPDATE_ERROR: "Erreur lors de la modification de l'utilisateur",
    POST_UPDATE_ERROR: "Erreur lors de la modification du post",
    USER_DELETE_ERROR: "Erreur lors de la suppression de l'utilisateur",
    POST_DELETE_ERROR: "Erreur lors de la suppression du post",
    USER_READ_ERROR: "Erreur lors de la lecture de l'utilisateur",
    POST_READ_ERROR: "Erreur lors de la lecture du post",
    
    // Server errors
    INTERNAL_SERVER_ERROR: "Erreur serveur interne"
};

// ==================== CLASSES D'ERREUR PERSONNALISÉES ====================

export class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class ValidationError extends AppError {
    constructor(message = ERROR_MESSAGES.NO_DATA_PROVIDED) {
        super(message, 400);
    }
}

export class NotFoundError extends AppError {
    constructor(message = ERROR_MESSAGES.RESOURCE_NOT_FOUND) {
        super(message, 404);
    }
}

export class FileError extends AppError {
    constructor(message = ERROR_MESSAGES.FILE_READ_ERROR) {
        super(message, 500);
    }
}
