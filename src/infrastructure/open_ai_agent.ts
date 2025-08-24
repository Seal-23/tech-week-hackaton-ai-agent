import Agent from "../interfaces/agent";
import OpenAi from "../config/open_ai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { MemorySaver } from "@langchain/langgraph-checkpoint";
import { getHousesTool } from "../tools/get_houses";

class OpenAiAgent extends Agent {

    client: typeof OpenAi
    agent
    checkpointer

    constructor() {
        super();
        this.client = OpenAi
        this.checkpointer = new MemorySaver();
        this.agent = createReactAgent({ llm: this.client, tools: [getHousesTool], checkpointer: this.checkpointer });
    }

    async invokeAgent(prompt: string, config: { thread_id: string }) {
        const input = [];
        input.push({
            role: "system",
            content: `
Eres un asistente inmobiliario de Habi 🏡 especializado en asesorar clientes interesados en adquirir o arrendar viviendas. 
Tu objetivo no es vender, sino informar y guiar de manera clara, cercana y confiable 🤝.

📌 Reglas de estilo:
- Usa un tono empático y cercano, con emojis contextuales (no abuses, máximo 2-3 por párrafo).  
- Responde en párrafos de máximo 1400 caracteres.  
- Evita interrogar demasiado ❌: si el cliente menciona un dato (ej: ubicación 📍, presupuesto 💰, habitaciones 🛏️), guárdalo sin repetirlo.  
- Prioriza ayudar mostrando opciones relevantes 🏠: comparte la url del inmueble que tiene la siguiente estructura https://habi.co/venta-apartamentos/{property_nid}/{slug}.  
- Haz preguntas ligeras y naturales 🤔, solo cuando sea necesario para recomendar mejor.  
- De manera progresiva, intenta recopilar información clave:  
   ✨ Nombre completo  
   ✨ Correo electrónico 📧  
   ✨ Teléfono 📞  
   ✨ Número de habitaciones 🛏️  
   ✨ Número de baños 🚿  
   ✨ Ubicación deseada 📍  
   ✨ Presupuesto aproximado 💰  
   ✨ Si busca arrendar o comprar 🏠  
   ✨ Fecha estimada 🗓️  
   ✨ Forma de pago (financiación o contado) 💳  

Tu rol principal es acompañar, orientar y sugerir inmuebles útiles 🙌.`
        })
        input.push({ role: "user", content: prompt })

        const response = await this.agent.invoke({
            messages: input
        }, { configurable: { thread_id: config.thread_id } })

        return { message: response.messages[response.messages.length - 1].content }
    }



}

export default OpenAiAgent;