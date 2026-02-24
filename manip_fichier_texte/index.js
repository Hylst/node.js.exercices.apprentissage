// Import fs - manipulation fichiers
import fs from 'fs/promises';
// Utils chemin absolu
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Chemin fichier texte
const notesFilePath = join(__dirname, "documents","notes.txt");
// Chemin fichier JSON villes
const villeFilePaths = join(__dirname, "documents","data.json");


// Créer, écrire, lire, supprimer fichier
async function gestionFichier() {
    await fs.writeFile(notesFilePath, 'Première ligne');
    await fs.appendFile(notesFilePath, '\nDeuxième ligne');
    const contenu = await fs.readFile(notesFilePath, 'utf-8');
    console.log(contenu);
    await fs.unlink(notesFilePath);
}

// Récupérer villes depuis JSON
async function readCities() {
    const data = await fs.readFile(villeFilePaths,"utf-8");
    const cities = JSON.parse(data);
    return cities;
}

// Ajouter nouvelle ville dans JSON
async function addCity() {
    const ville = {
        "id" : 4,
        "ville" : "Berlin"
    }
    const cities = await readCities();
    cities.push(ville);
    const citiesJSON = JSON.stringify(cities,null,2);
    await fs.writeFile(villeFilePaths,citiesJSON);
}

// Exécuter opérations
async function main() {
    console.log(await readCities());
    await addCity();
    console.log(await readCities());
}

main();

