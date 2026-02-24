// Import express - lib serveur HTTP
import express from "express";

// Créer app express
const app = express();
// Port serveur (3000 dev)
const PORT = 3000;

app.use(express.json());

// Démarrer serveur - écouter port
app.listen(PORT, ()=> {
    console.log(`Serveur démarré sur http://localhost:${PORT}`)
});

// Route GET basique (/)
app.get("/",(req,res)=>{
    res.send("Bienvenue sur mon site");
})

// Route GET users avec gestion query
app.get("/users",(req,res)=>{
   // res.send("Bienvenue la liste des utilisateurs");

    const age = req.query.age;
    const city = req.query.city;

    res.send(`Age demandé ${age} et ville ${city}`);
})


// Route POST users avec gestion json
app.post("/users",(req,res)=>{
    // const data = req.body;
    const {id, name, age, city} = req.body;
    res.json({
        "message" : "Utilisateur bien créé :",
        "NewUser" : name
    });
})

// Route GET dynamique avec param ID
app.get("/users/:id",(req,res)=>{
    const id = parseInt(req.params.id);
    // test si nombre
    if(isNaN(id)) {
        res.send("Erreur : l'ID doit être un nombre");
    } else {
        res.send(`J'ai reçu l'ID n°${id}`);
    }
})

