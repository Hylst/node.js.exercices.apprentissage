// Import fs - gestion fichiers avec promesses
import fs from  "fs/promises";
// Utils pour construire chemin absolu
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Chemin fichier à manipuler
const filepath = join(__dirname,"document","texte.txt");

// Lire et afficher contenu fichier
async function readFile() {
    const contenu = await fs.readFile(filepath,"utf-8");
    console.log(contenu);    
}

// Écrire dans fichier (écrase ancien contenu)
async function writeFile() {
    await fs.writeFile(filepath,"Nouveau texte qui écrase le précédent."); 
}

// Ajouter ligne à fin fichier
async function addText() {
    await fs.appendFile(filepath,"\nNouvelle ligne de texte ajoutée (nouvelle ligne)");
}

// Supprimer fichier
async function deleteFile() {
    await fs.unlink(filepath);
}

// Exécuter opérations en séquence
async function main() {
    await writeFile();
    await readFile();
    await addText();
    await readFile();
    await deleteFile();
}

// Lancer script
main();

