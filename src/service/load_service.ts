import fs from "fs";
import path from "path";
import { pc } from "../config/pinecone";


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

    const firstTen = subfolders.slice(1, 189);

    for (const folder of firstTen) {
        const folderPath = path.join(ROOT_DIR, folder);

        const files = fs
            .readdirSync(folderPath, { withFileTypes: true })
            .filter((f) => f.isFile())
            .map((f) => path.join(folderPath, f.name));

        const chunks = chunkArray(files, 50);
        const index = pc.index("habi").namespace("houses");


        console.log(`📂 Carpeta ${folder} → ${chunks.length} lotes`);

        for (const [i, chunk] of chunks.entries()) {
            const records = []
            console.log(`  🚀 Subiendo lote ${i + 1} con ${chunk.length} archivos...`);
            await Promise.all(
                chunk.map(async (filePath) => {
                    try {
                        const fileContent = fs.readFileSync(filePath, 'utf-8');
                        const metadata = JSON.parse(fileContent)
                        const text = `
${metadata.title || "Sin título"}.
Ubicación: ${metadata.neighborhood || ""}, ${metadata.city_name || ""}.
Tipo de negocio: ${metadata.business_type || ""}, tipo de propiedad: ${metadata.metadata_type || ""}.
Habitaciones: ${metadata.rooms || 0}, Baños: ${metadata.bathrooms || 0}, Parqueadero: ${metadata.garage || 0}.
Área: ${metadata.area || 0} m², Área construida: ${metadata.built_area || 0} m².
Elevador: ${metadata.elevator ? "Sí" : "No"}.
Valor arriendo: ${metadata.rent_value || "N/A"}, Valor administración: ${metadata.management_value || "N/A"}.
Estado: ${metadata.status || "N/A"}.
  `.trim();
                        records.push({
                            _id: metadata.web_id,
                            text,
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