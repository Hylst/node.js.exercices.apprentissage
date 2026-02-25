// Import express pour créer le serveur web
import express from "express";
// Import fs pour lire/écrire les fichiers JSON
import fs from 'fs/promises';
// Import pour obtenir le chemin du fichier courant
import { fileURLToPath } from "url"
// Import pour manipuler les chemins de fichiers
import path from "path"

// Crée l'application Express
const app = express();
// Port sur lequel le serveur écoutera
const PORT = 3000;

// Récupère le chemin du répertoire courant
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Chemins vers les fichiers de données
const dataPath = path.join(__dirname,"data","data.json");
const concertsPath = path.join(__dirname,"data","concerts.json");

async function logger(req,res,next) {
    console.log(`Méthonde ${req.method} - URL démandée : ${req.url}`);
    next();
    };

async function checkID(req,res,next) {

    next();
    };

// Middleware pour parser le JSON dans les requêtes
app.use(express.json());
app.use(logger());

// Démarre le serveur
app.listen(PORT, ()=> {
    console.log(`Serveur démarré sur le port ${PORT}`);
});

// Route racine - page d'accueil
app.get("/", (req,res) => {
    res.send("Bienvenue sur le site officiel du Festival de Musique ! Découvrez vos artistes et concerts favoris.");
});

// Route pour afficher un artiste par ID, genre et nom
app.get("/artistes/:id/:genre/:nom", (req,res) => {
    const id = req.params.id;
    const genre = req.params.genre;
    const nom = req.params.nom;
    
    // Vérifie que l'ID est bien un nombre
    if (isNaN(id)) {
        return res.json({ "message": "L'id doit être un nombre" });
    }

    // Retourne les infos de l'artiste
    res.json({
        message : `L'artiste ${nom} performe dans la catégorie ${genre}`,
        id : id,
        genre : genre,
        nom : nom
    });
});

// Route GET pour récupérer tous les concerts
app.get("/concerts", async (req,res) => {
    try {
        // Lit le fichier JSON et le parse
        const contenu = await fs.readFile(concertsPath, 'utf-8');
        const concerts = JSON.parse(contenu);

        // Renvoie la liste des concerts
        res.json({
            message : "Voici le résultat de la recherche",
            concerts : concerts
        });
    } catch (error) {
        // Gère les erreurs de lecture
        res.status(500).json({ message: "Erreur lors de la lecture des concerts" });
    }
});

// Route POST pour ajouter un nouveau concert
app.post("/concerts", async (req,res) => {
    try {
        // Lit les concerts existants
        const contenu = await fs.readFile(concertsPath, 'utf-8');
        const concerts = JSON.parse(contenu);
        
        // Ajoute le nouveau concert
        concerts.push(req.body);
        
        // Sauvegarde dans le fichier
        await fs.writeFile('concerts.json', JSON.stringify(concerts, null, 2));
        
        // Renvoie une confirmation
        res.status(201).json({
            message : "Concert ajouté avec succès",
            ...req.body
        });
    } catch (error) {
        // Gère les erreurs d'écriture
        res.status(500).json({ message: "Erreur lors de l'ajout du concert" });
    }
});

// Fonction utilitaire pour lire les concerts
async function readConcerts() {
    const data = await fs.readFile(concertsPath, "utf-8");
    const concerts = JSON.parse(data);
    return concerts;    
}

// Route DELETE pour supprimer un concert par ID
app.delete('/concerts/:id', async (req,res)=>{
    const id = parseInt(req.params.id);
    if(isNaN(id)){
        return res.json({message:"L'ID doit être un chiffre."});
    }

    // Lit les concerts, filtre pour enlever celui avec l'ID donné
    const concerts = await readConcerts();
    const newconcerts = concerts.filter(user=>user.id!==id);
    const concertsJSON = JSON.stringify(newconcerts,null,2);
    await fs.writeFile(concertsPath,concertsJSON);

    res.json({
        message:`Le concert avec l'ID ${id} a bien été supprimé.`
    });
})

// Route PUT pour modifier un concert par ID
app.put('/concerts/:id', async (req,res)=> {
    const id = parseInt(req.params.id);
    if(isNaN(id)){
        return res.json({message:"L'ID doit être un chiffre."});
    }

    const concerts = await readConcerts()
    const { artiste, genre, ville, date, scene, prix } = req.body;

    // Vérifie qu'au moins un champ est fourni
    if (!artiste && !genre && !ville && !date && !scene && !prix) {
            res.json({
        message:"Au moins un des champs est nécessaire."
    });
    }

    // Trouve le concert à modifier
    const indexUserToModify = concerts.findIndex(user=>user.id===id);
    if (indexUserToModify == -1) {
            res.json({
        message:`Concert introuvable`
    });
    }
    // Met à jour les infos du concert
    concerts[indexUserToModify] = { id, artiste, genre, ville, date, scene, prix };

    // Sauvegarde les modifications
    const concertsJSON = JSON.stringify(concerts,null,2);
    await fs.writeFile(concertsPath,concertsJSON);

    res.json({
        message:`Le concert avec l'ID ${id} a bien été modifié.`,
        concert:concertsJSON
    });
})
