import express from "express";
import fs from 'fs/promises';

const app = express();
const PORT = 3000;

app.use(express.json());

app.listen(PORT, ()=> {
    console.log(`Serveur démarré sur le port ${PORT}`);
});

app.get("/", (req,res) => {
    res.send("Bienvenue sur le site officiel du Festival de Musique ! Découvrez vos artistes et concerts favoris.");
});

app.get("/artistes/:id/:genre/:nom", (req,res) => {
    const id = req.params.id;
    const genre = req.params.genre;
    const nom = req.params.nom;
    
    if (isNaN(id)) {
        return res.json({ "message": "L'id doit être un nombre" });
    }

    res.json({
        message : `L'artiste ${nom} performe dans la catégorie ${genre}`,
        id : id,
        genre : genre,
        nom : nom
    });
});

app.get("/concerts", async (req,res) => {
    try {
        const contenu = await fs.readFile('concerts.json', 'utf-8');
        const concerts = JSON.parse(contenu);

        res.json({
            message : "Voici le résultat de la recherche",
            concerts : concerts
        });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la lecture des concerts" });
    }
});

app.post("/concerts", async (req,res) => {
    try {
        const contenu = await fs.readFile('concerts.json', 'utf-8');
        const concerts = JSON.parse(contenu);
        
        concerts.push(req.body);
        
        await fs.writeFile('concerts.json', JSON.stringify(concerts, null, 2));
        
        res.status(201).json({
            message : "Concert ajouté avec succès",
            ...req.body
        });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'ajout du concert" });
    }
});
