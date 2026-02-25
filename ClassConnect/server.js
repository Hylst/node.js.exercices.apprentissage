// Import express pour créer le serveur web
import express from "express";
// Import fs pour lire/écrire les fichiers JSON
import fs from 'fs/promises';
// Import pour obtenir le chemin du fichier courant
import { fileURLToPath } from "url"
// Import pour manipuler les chemins de fichiers
import path from "path"
// Import des middlewares
import { validateId, validateData, handleResult, errorHandler } from "./middlewares.js"

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
        return {message:"L'ID doit être un chiffre."};
    }
    if(!newData) {
        return {message:"Aucune donnée fournie."};
    }

    const dataObject = await readData(filePath);
    const indexToModify = dataObject.findIndex(item => item.id === parseInt(id));
    
    if(indexToModify === -1) {
        return {message:"Élément introuvable."};
    }

    dataObject[indexToModify] = { id: parseInt(id), ...newData };

    // Save dans fichier
    await fs.writeFile(filePath, JSON.stringify(dataObject, null, 2));

    return dataObject[indexToModify];    
}

async function delData(filePath, id) {
    if(isNaN(id)) {
        return {message:"L'ID doit être un chiffre."};
    }

    const dataObject = await readData(filePath);
    const newData = dataObject.filter(data => data.id !== parseInt(id));

    if(newData.length === dataObject.length) {
        return {message:"Élément introuvable."};
    }

    // Sauve dans fichier
    await fs.writeFile(filePath, JSON.stringify(newData, null, 2));

    return {message: "Élément supprimé avec succès."};    
}



// ==================== ROUTES USERS ====================

// GET /users - Récup all users
app.get("/users", async (req,res) => {
    try {
        const users = await readData(usersPath);
        res.json({
            message: "Voici la liste des utilisateurs",
            users: users
        });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la lecture des utilisateurs" });
    }
});

// POST /users - Add new user
app.post("/users", validateData, async (req,res) => {
    try {
        const result = await addData(usersPath, req.body);
        res.status(201).json({
            message: "Utilisateur ajouté avec succès",
            user: req.body
        });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'ajout de l'utilisateur" });
    }
});

// GET /users/:id - Récup 1 user par ID
app.get("/users/:id", validateId, async (req,res) => {
    try {
        const users = await readData(usersPath);
        const user = users.find(u => u.id === req.id);

        if(!user) {
            return res.status(404).json({ message: "Utilisateur introuvable" });
        }

        res.json({
            message: "Utilisateur trouvé",
            user: user
        });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la lecture de l'utilisateur" });
    }
});

// PUT /users/:id - Modif un user
app.put("/users/:id", validateId, validateData, async (req,res) => {
    try {
        const result = await modData(usersPath, req.body, req.id);
        
        if (handleResult(req, res, result)) {
            return;
        }

        res.json({
            message: `L'utilisateur avec l'ID ${req.id} a bien été modifié`,
            user: result
        });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la modification de l'utilisateur" });
    }
});

// DELETE /users/:id - Supp un user
app.delete("/users/:id", validateId, async (req,res) => {
    try {
        const result = await delData(usersPath, req.id);
        
        if (handleResult(req, res, result)) {
            return;
        }

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression de l'utilisateur" });
    }
});

// ==================== ROUTES POSTS ====================

// GET /posts - Récup tous les posts
app.get("/posts", async (req,res) => {
    try {
        const posts = await readData(postsPath);
        res.json({
            message: "Voici la liste des posts",
            posts: posts
        });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la lecture des posts" });
    }
});

// POST /posts - Add new post
app.post("/posts", validateData, async (req,res) => {
    try {
        const result = await addData(postsPath, req.body);
        res.status(201).json({
            message: "Post ajouté avec succès",
            post: req.body
        });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'ajout du post" });
    }
});

// GET /posts/:id - Récup post par ID
app.get("/posts/:id", validateId, async (req,res) => {
    try {
        const posts = await readData(postsPath);
        const post = posts.find(p => p.id === req.id);

        if(!post) {
            return res.status(404).json({ message: "Post introuvable" });
        }

        res.json({
            message: "Post trouvé",
            post: post
        });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la lecture du post" });
    }
});

// PUT /posts/:id - Modif un post
app.put("/posts/:id", validateId, validateData, async (req,res) => {
    try {
        const result = await modData(postsPath, req.body, req.id);
        
        if (handleResult(req, res, result)) {
            return;
        }

        res.json({
            message: `Le post avec l'ID ${req.id} a bien été modifié`,
            post: result
        });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la modification du post" });
    }
});

// DELETE /posts/:id - Supp un post
app.delete("/posts/:id", validateId, async (req,res) => {
    try {
        const result = await delData(postsPath, req.id);
        
        if (handleResult(req, res, result)) {
            return;
        }

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression du post" });
    }
})

// Middleware de gestion d'erreurs centralisé (doit être en dernier)
app.use(errorHandler);
