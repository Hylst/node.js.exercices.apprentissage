// Import fs - manipulation fichiers
import fs from 'fs/promises';
// Utils chemin absolu
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Chemin JSON prénoms
const FilePath = join(__dirname, "documents","data.json");

// CRUD JSON: créer, lire, ajouter, modifier prénoms
async function gestionJSON() {
    // Étape 1: Créer fichier JSON prénoms
    const initialData = [
        { id: 1, nom: "Cunégonde", age: 54 },
        { id: 2, nom: "Bob", age: 35 },
        { id: 3, nom: "Gérard", age: 78 }
    ];
    
    console.log("=== Étape 1: Création fichier JSON ===");
    await fs.writeFile(FilePath, JSON.stringify(initialData, null, 2));
    console.log("✓ Fichier créé\n");
    
    // Étape 2: Lire et afficher JSON
    console.log("=== Étape 2: Lecture ===");
    let contenu = await fs.readFile(FilePath, 'utf-8');
    let data = JSON.parse(contenu);
    console.log(JSON.stringify(data, null, 2));
    console.log();
    
    // Étape 3: Ajouter entrée
    console.log("=== Étape 3: Ajout entrée ===");
    data.push({ id: 4, nom: "Isabelle", age: 42 });
    await fs.writeFile(FilePath, JSON.stringify(data, null, 2));
    contenu = await fs.readFile(FilePath, 'utf-8');
    data = JSON.parse(contenu);
    console.log(JSON.stringify(data, null, 2));
    console.log();
    
    // Étape 4: Modifier entrée
    console.log("=== Étape 4: Modification ===");
    const indexToModify = data.findIndex(p => p.id === 2);
    if (indexToModify !== -1) {
        data[indexToModify].age = 36;
        data[indexToModify].nom = "Robert";
    }
    await fs.writeFile(FilePath, JSON.stringify(data, null, 2));
    contenu = await fs.readFile(FilePath, 'utf-8');
    data = JSON.parse(contenu);
    console.log(JSON.stringify(data, null, 2));
}

gestionJSON();
