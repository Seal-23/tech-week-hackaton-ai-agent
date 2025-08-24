import fs from "fs";
import path from "path";
import { pc } from "../config/pinecone";
import { id } from "zod/dist/types/v4/locales";


const ROOT_DIR = "/Users/SALARC1/Documents/TechWeek/tech-week-hackaton-ai-agent/houses";

function chunkArray<T>(array: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
}

export async function processFolders() {

    const subfolders = fs
        .readdirSync(ROOT_DIR, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory() && /^\d+$/.test(dirent.name))
        .map((dirent) => dirent.name)
        .sort((a, b) => Number(a) - Number(b));

    const firstTen = subfolders.slice(0, 2);

    for (const folder of firstTen) {
        const folderPath = path.join(ROOT_DIR, folder);

        const files = fs
            .readdirSync(folderPath, { withFileTypes: true })
            .filter((f) => f.isFile())
            .map((f) => path.join(folderPath, f.name));

        const chunks = chunkArray(files, 50);
        const index = pc.index("habi").namespace("scrapper");


        console.log(`📂 Carpeta ${folder} → ${chunks.length} lotes`);

        for (const [i, chunk] of chunks.entries()) {
            const records = []
            console.log(`  🚀 Subiendo lote ${i + 1} con ${chunk.length} archivos...`);
            await Promise.all(
                chunk.map(async (filePath) => {
                    try {
                        const fileContent = fs.readFileSync(filePath, 'utf-8');
                        const metadata = JSON.parse(fileContent);
                        Object.keys(metadata).forEach((k) => {
                            if (!metadata[k]) {
                                metadata[k] = ""
                            }
                        })
                        records.push({
                            _id: String(metadata.property_card_id),
                            text: "Este inmueble tiene un precio de: " + metadata.sale_price + "COP y ademas lo describiriamos como," + metadata.description,
                            ...metadata
                        })

                    } catch (err) {
                        console.error(`     ❌ Error subiendo ${filePath}`, err);
                    }
                })
            );
            await index.upsertRecords(records);
        }
    }

}