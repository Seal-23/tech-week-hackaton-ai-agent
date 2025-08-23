import OpenAI from 'openai';
import dotenv from 'dotenv';
import express from 'express';
import twilio from 'twilio';

dotenv.config();
const app = express();
const port = 3000;

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const openAikey = process.env.OPENAI_KEY;

const client = twilio(accountSid, authToken);
const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
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
        to: `whatsapp:+${WaId}`,
    });

    console.log(message.sid);
    res.send();
});

app.get('/', (_, res) => res.send('OK'));


app.listen(port, err => {
    if (err) {
        return console.error(err);
    }
    return console.log(`server is listening on ${port}`);
});