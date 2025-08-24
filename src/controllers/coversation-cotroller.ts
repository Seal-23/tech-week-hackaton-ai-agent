import { Request, response, Response } from "express";
import Agent from "../interfaces/agent";
import Whatsapp from "../interfaces/whatsapp";
import { CheckOrCreateActiveThread } from "../decorators/active_thread";

class ConversationController {

    private agent: Agent;
    private whatsapp: Whatsapp;
    private readonly from = "14155238886";

    constructor(agent: Agent, whatsapp: Whatsapp) {
        this.agent = agent;
        this.whatsapp = whatsapp;
    }

    @CheckOrCreateActiveThread()
    public async receiveMessage(req: Request & { activeThread: string }, res: Response) {
        const { Body, WaId } = req.body;
        console.log(req.activeThread + ":)")
        const response = await this.agent.invokeAgent(Body, { thread_id: req.activeThread });
        this.whatsapp.sendMesagge(response, { from: this.from, to: WaId })
        res.json({ success: true })
    }
}

export { ConversationController }