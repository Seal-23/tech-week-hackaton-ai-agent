
import { Request, Response, NextFunction } from "express";
import { PrismaDatabase } from "../config/database";
import { v4 as uuidv4 } from "uuid";


export function CheckOrCreateActiveThread() {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        const originalMethod = descriptor.value;
        
        descriptor.value = async function (req: Request, res: Response) {
            try {
                const { WaId } = req.body;

                if (!WaId) {
                    return res.status(400).json({ error: "WaId es requerido en el body" });
                }

                const prisma = PrismaDatabase.connection();

                let activeThread = await prisma.messageThread.findFirst({
                    where: {
                        customer_phone_number: WaId,
                        status: "ACTIVE",
                    },
                });

                if (!activeThread) {
                    activeThread = await prisma.messageThread.create({
                        data: {
                            customer_phone_number: WaId,
                            thread_id: uuidv4(),
                            status: "ACTIVE",
                        },
                    });
                }

                (req as any).activeThread = activeThread.thread_id;

                return originalMethod.apply(this, [req, res]);
            } catch (err) {
                console.error("Error en CheckActiveThread:", err);
                return res.status(500).json({ error: "Error interno en validación" });
            }
        };

        return descriptor;
    };
}