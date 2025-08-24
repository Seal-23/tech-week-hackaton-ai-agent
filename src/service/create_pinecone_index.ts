import { pc } from "../config/pinecone";


export async function createIndex() {
    await pc.createIndexForModel({
        name: "habi",
        cloud: 'aws',
        region: 'us-east-1',
        embed: {
            model: 'llama-text-embed-v2',
            fieldMap: { text: 'text' },
        },
        waitUntilReady: true,
    });
}
