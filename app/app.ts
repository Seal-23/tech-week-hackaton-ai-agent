import OpenAI from 'openai';
import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import os from 'os';
import path from 'path';
import twilio from 'twilio';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();
const app = express();
const port = 3000;

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const openAikey = process.env.OPENAI_KEY;

const client = twilio(accountSid, authToken);

const openai = new OpenAI({
    apiKey: openAikey,
});

app.use(express.urlencoded({ extended: true }));

app.post('/message-recived', async (req, res) => {
    const { ProfileName, Body, WaId } = req.body

    const response = await openai.chat.completions.create({
        model: 'openai/gpt-4o',
        messages: [
            {
                role: 'user',
                content: Body,
            },
            {
                role: 'developer',
                content: 'you are a assistant from Habi Broker platform',
            },
        ],
    });
    const messageToResponse = response.choices[0].message.content;

    //SEND A RESPONSE MESSAGE

    const message = await client.messages.create({
        body: messageToResponse,
        from: 'whatsapp:+14155238886',
        to: `whatsapp:+${WaId}`, // Ensure WaId includes country code
    });

    console.log(message.sid);
    res.send();
});

app.get('/', (_, res) => res.send('OK'));

app.post('/create-vectorStore', async (req, res) => {
    const vectorStore = await openai.vectorStores.create({
        name: "HackatonVectorStore"
    });
    res.send(vectorStore);
})

app.post('/add-to-vectorStore/:vectorStoreID', async (req, res) => {
    const { vectorStoreID } = req.params;
    const housesList = fs.readFileSync('./test.json', 'utf8')
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);


    // Use Promise.all to handle async uploads and cleanup
    housesList.forEach(async (house, index) => {
        const tempFileName = path.join(os.tmpdir(), `${uuidv4()}.json`);
        fs.writeFileSync(tempFileName, house);

        const file = await openai.files.create({
            file: fs.createReadStream(tempFileName),
            purpose: 'assistants'
        });

        await openai.vectorStores.files.create(vectorStoreID, {
            file_id: file.id
        });

        if (index % 100 === 0) {
            console.log(`Processed ${index + 1} / ${housesList.length}`);
        }
        // Remove temp file after upload
        fs.unlinkSync(tempFileName);
    });

    res.send({ success: true });
});

app.listen(port, err => {
    if (err) {
        return console.error(err);
    }
    return console.log(`server is listening on ${port}`);
});