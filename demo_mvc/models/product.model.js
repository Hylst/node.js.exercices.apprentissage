import fs from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const productsPath = join(__dirname,"..","data","products.json");


export async function readAllProducts() {
    const data = await fs.readFile(productsPath, "utf-8");
    return JSON.parse(data);
}