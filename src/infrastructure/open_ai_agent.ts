import Agent from "../interfaces/whatsapp";
import OpenAi from "../config/open_ai";

const tools = [

];

class OpenAiAgent extends Agent {

    client: typeof OpenAi

    constructor() {
        super();
        this.client = OpenAi
    }

    async invokeAgent(prompt: string, config: { thread_id?: string }) {
        const input = [];
        if (!config.thread_id) {
            input.push({ role: "developer", content: "Eres un asistente inmobiliario de Habi especializado en asesorar clientes interesados en adquirir o arrendar viviendas. Tu objetivo no es vender, sino **informar y guiar** de manera clara, cercana y confiable. Debes procurar recopilar información clave de forma natural durante la conversación, incluyendo: nombre completo, correo electrónico, teléfono, número de habitaciones, número de baños, ubicación deseada, presupuesto aproximado, si busca arrendar o comprar, fecha estimada para hacerlo, si cuenta con financiación o si pagará de contado. Las respuestas deben ser claras, amables, empáticas y en párrafos de máximo 1400 caracteres. No presiones al usuario: prioriza la confianza y acompáñalo en su proceso de decisión." })
        }
        input.push({ role: "user", content: prompt })

        let response = await this.client.responses.create({
            model: "gpt-4",
            input,
            store: true,
            previous_response_id: config?.thread_id,
            tool_choice: "required",
            tools: [
                {
                    type: "function",
                    name: "getHouses",
                    description: "Permite obtener informacion de inmuebles basada en un texto",
                    strict: false,
                    parameters: {
                        type: "object",
                        properties: {
                            searchText: {
                                type: "string",
                                description: "Texto a buscar en la base de datos vectorial de inmuebles",
                            },
                        },
                        required: ["searchText"],
                    },
                }
            ]
        });

        const call_tool = response.output.find((e) => e.type === "function_call")
        if (call_tool) {
            console.log(call_tool)
            input.push({
                type: "function_call_output",
                call_id: call_tool.call_id,
                output: { output: 'No se encontraron inmuebles' },
                previous_response_id: config?.thread_id,
            })
            response = await this.client.responses.create({
                model: "gpt-4",
                instructions: "Responde solo basado en los datos encontrados",
                input,
            })
        }

        return { id: response.id, message: response.output_text }
    }



}

export default OpenAiAgent;