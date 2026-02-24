import express from "express"
import fs from "fs/promises"
import { fileURLToPath } from "url"
import path from "path"

const PORT = 5000;
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const usersPath = path.join(__dirname,"data","users.json");

app.listen(PORT, ()=>{
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
})

async function readUsers() {
    const data = await fs.readFile(usersPath, "utf-8");
    const users = JSON.parse(data);
    return users;    
}

app.get('/', (req,res)=> {
    res.send("Bienvenue sur le site ! ");
})

app.get('/users', async (req,res)=> {
    const users = await readUsers();
    res.json({
        message:"Voici la liste des utilisateurs",
        utilisateurs:users
    });
})

app.delete('/users/:id', async(req,res)=>{
    const id = parseInt(req.params.id);
    if(isNaN(id)){
        return res.json({message:"L'ID doit être un chiffre."});
    }

    const users = await readUsers();
    const newUsers = users.filter(user=>user.id!==id);
    const usersJSON = JSON.stringify(newUsers,null,2);
    await fs.writeFile(usersPath,usersJSON);

    res.json({
        message:`L'utilisateur avec l'ID ${id} a bien été supprimé.`
    });
})