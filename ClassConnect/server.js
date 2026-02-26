// Import express pour créer le serveur web
import express from "express";
// Import fs pour lire/écrire les fichiers JSON
import fs from 'fs/promises';
// Import pour obtenir le chemin du fichier courant
import { fileURLToPath } from "url"
// Import pour manipuler les chemins de fichiers
import path from "path"
// Import des middlewares
import { validateId, validateData, handleResult, errorHandler, asyncHandler } from "./middlewares.js"
// Import des erreurs et messages
import { ERROR_MESSAGES, ValidationError, NotFoundError } from "./errors.js"

// Crée l'application Express
const app = express();
// Port sur lequel le serveur écoutera
const PORT = 3000;

// Récupère le chemin du répertoire courant
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Chemins vers les fichiers de données
const postsPath = path.join(__dirname,"data","posts.json");
const usersPath = path.join(__dirname,"data","users.json");

// Middleware parsing JSON dans requêtes
app.use(express.json());

// Démarre le serveur
app.listen(PORT, ()=> {
    console.log(`Serveur démarré sur le port ${PORT}`);
});

// Route racine - page d'accueil
app.get("/", (req,res) => {
    res.send("Bienvenue sur ClassConnect !");
});

// Fonction utilitaire lecture data fichier
async function readData(filePath) {
    const dataString = await fs.readFile(filePath, "utf-8");
    const dataObject = JSON.parse(dataString);
    return dataObject;    
}

async function addData(filePath, newData) {
    const dataObject = await readData(filePath);
    dataObject.push(newData);

    // Sauvegarde dans le fichier
    await fs.writeFile(filePath, JSON.stringify(dataObject, null, 2));

    return dataObject;    
}

async function modData(filePath, newData, id) {
    if(isNaN(id)) {
        throw new ValidationError(ERROR_MESSAGES.INVALID_ID);
    }
    if(!newData || Object.keys(newData).length === 0) {
        throw new ValidationError(ERROR_MESSAGES.NO_DATA_PROVIDED);
    }

    const dataObject = await readData(filePath);
    const indexToModify = dataObject.findIndex(item => item.id === parseInt(id));
    
    if(indexToModify === -1) {
        throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    }

    dataObject[indexToModify] = { id: parseInt(id), ...newData };

    // Save dans fichier
    await fs.writeFile(filePath, JSON.stringify(dataObject, null, 2));

    return dataObject[indexToModify];    
}

async function delData(filePath, id) {
    if(isNaN(id)) {
        throw new ValidationError(ERROR_MESSAGES.INVALID_ID);
    }

    const dataObject = await readData(filePath);
    const newData = dataObject.filter(data => data.id !== parseInt(id));

    if(newData.length === dataObject.length) {
        throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    }

    // Sauve dans fichier
    await fs.writeFile(filePath, JSON.stringify(newData, null, 2));

    return {message: "Élément supprimé avec succès."};    
}



// ==================== ROUTES USERS ====================

// GET /users - Récup all users
app.get("/users", asyncHandler(async (req,res) => {
    const users = await readData(usersPath);
    res.json({
        message: "Voici la liste des utilisateurs",
        users: users
    });
}));

// POST /users - Add new user
app.post("/users", validateData, asyncHandler(async (req,res) => {
    const result = await addData(usersPath, req.body);
    res.status(201).json({
        message: "Utilisateur ajouté avec succès",
        user: req.body
    });
}));

// GET /users/:id - Récup 1 user par ID
app.get("/users/:id", validateId, asyncHandler(async (req,res) => {
    const users = await readData(usersPath);
    const user = users.find(u => u.id === req.id);

    if(!user) {
        throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    res.json({
        message: "Utilisateur trouvé",
        user: user
    });
}));

// PUT /users/:id - Modif un user
app.put("/users/:id", validateId, validateData, asyncHandler(async (req,res) => {
    const result = await modData(usersPath, req.body, req.id);
    res.json({
        message: `L'utilisateur avec l'ID ${req.id} a bien été modifié`,
        user: result
    });
}));

// DELETE /users/:id - Supp un user
app.delete("/users/:id", validateId, asyncHandler(async (req,res) => {
    const result = await delData(usersPath, req.id);
    res.json(result);
}));

// ==================== ROUTES POSTS ====================

// GET /posts - Récup tous les posts
app.get("/posts", asyncHandler(async (req,res) => {
    const posts = await readData(postsPath);
    res.json({
        message: "Voici la liste des posts",
        posts: posts
    });
}));

// POST /posts - Add new post
app.post("/posts", validateData, asyncHandler(async (req,res) => {
    const result = await addData(postsPath, req.body);
    res.status(201).json({
        message: "Post ajouté avec succès",
        post: req.body
    });
}));

// GET /posts/:id - Récup post par ID
app.get("/posts/:id", validateId, asyncHandler(async (req,res) => {
    const posts = await readData(postsPath);
    const post = posts.find(p => p.id === req.id);

    if(!post) {
        throw new NotFoundError(ERROR_MESSAGES.POST_NOT_FOUND);
    }

    res.json({
        message: "Post trouvé",
        post: post
    });
}));

// PUT /posts/:id - Modif un post
app.put("/posts/:id", validateId, validateData, asyncHandler(async (req,res) => {
    const result = await modData(postsPath, req.body, req.id);
    res.json({
        message: `Le post avec l'ID ${req.id} a bien été modifié`,
        post: result
    });
}));

// DELETE /posts/:id - Supp un post
app.delete("/posts/:id", validateId, asyncHandler(async (req,res) => {
    const result = await delData(postsPath, req.id);
    res.json(result);
}))

// Middleware de gestion d'erreurs centralisé (doit être en dernier)
app.use(errorHandler);
