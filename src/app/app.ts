import express from 'express';
import { ConversationController } from '../controllers/coversation-cotroller';
import OpenAiAgent from '../infrastructure/open_ai_agent';
import TwilioWhatsApp from '../infrastructure/whatsapp_twilio';
import { processFolders } from '../service/load_service';
import { createIndex } from '../service/create_pinecone_index';


const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));

const agentImpl = new OpenAiAgent();
const whatsapImpl = new TwilioWhatsApp();

const conversationController = new ConversationController(agentImpl, whatsapImpl);

app.post('/message-recived', conversationController.receiveMessage.bind(conversationController));

app.get('/create-index', async (req, res) => { await createIndex(); res.json({ success: true }) });
app.get('/upload', async (req, res) => { await processFolders(); res.json({ success: true }) });

app.get('/', (_, res) => res.send('OK'));

app.listen(port, err => {
    if (err) {
        return console.error(err);
    }
    return console.log(`server is listening on ${port}`);
});