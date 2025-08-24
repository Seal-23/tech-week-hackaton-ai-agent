import { Request, response, Response } from "express";
import Agent from "../interfaces/agent";
import Whatsapp from "../interfaces/whatsapp";
import { CheckOrCreateActiveThread } from "../decorators/active_thread";
import { v4 as uuidv4 } from "uuid";
import { PrismaDatabase } from "../config/database";
import { PrismaClient } from "@prisma/client";

class ConversationController {

    private agent: Agent;
    private whatsapp: Whatsapp;
    private prisma: PrismaClient;
    private readonly from = "14155238886";

    constructor(agent: Agent, whatsapp: Whatsapp) {
        this.agent = agent;
        this.whatsapp = whatsapp;
        this.prisma = PrismaDatabase.connection();
    }

    @CheckOrCreateActiveThread()
    public async receiveMessage(req: Request & { activeThread?: string }, res: Response) {
        const { Body, WaId } = req.body;
        const response = await this.agent.invokeAgent(Body, { thread_id: req.activeThread });
        this.whatsapp.sendMesagge(response.message, { from: this.from, to: WaId });
        if (req.activeThread) {
            await this.prisma.messageThread.update({
                where: { thread_id: req.activeThread },
                data: { thread_id: response.id }
            });
        } else {
            await this.prisma.messageThread.create({
                data: {
                    customer_phone_number: WaId,
                    thread_id: response.id,
                    status: "ACTIVE",
                },
            });
        }
        res.json({ success: true })
    }
}

export { ConversationController }