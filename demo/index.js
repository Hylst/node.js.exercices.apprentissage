import express from "express";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import path from "path";

const app= express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const concertsPath = path.join(__dirname, "data", "concerts.json");

app.use(express.json());

app.get('/', (req,res)=>{
    res.send("Bienvenue sur le site officiel du Festival de Musique ! Découvrez vos artistes et concerts favoris.")
})


app.get('/artistes/:id/:genre/:nom', (req,res)=>{
    const {id, genre, nom } = req.params;

    if (isNaN(id)){
        return res.json({message: "L'id doit être un nombre"});
    }

    res.json({
        message : `L'artiste ${nom} performe dans la catégorie ${genre}`,
        id : Number(id),
        nom: nom,
        genre: genre
    });
})

app.get('/concerts', async(req,res)=>{

    const {ville, date} = req.query;

    const data = await fs.readFile(concertsPath, "utf-8");
    const concerts = JSON.parse(data);

    res.json({
        message: "Voici le résultat de la recherche",
        query : {ville, date},
        concerts: concerts
    });

})

app.post('/concerts', async(req,res)=>{
    const newConcert = req.body;

    const data = await fs.readFile(concertsPath, "utf-8");
    const concerts = JSON.parse(data);

    concerts.push(newConcert);

    await fs.writeFile(concertsPath, JSON.stringify(concerts, null, 2));

    res.json({
        message: "Concert ajouté avec succès",
        concert : newConcert
    });

})


app.listen(PORT, ()=>{
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
})