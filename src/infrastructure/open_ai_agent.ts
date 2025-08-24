import Agent from "../interfaces/whatsapp";
import OpenAi from "../config/open_ai";

class OpenAiAgent extends Agent {

    client: typeof OpenAi

    constructor() {
        super();
        this.client = OpenAi
    }

    async invokeAgent(prompt: string, config: { thread_id: string }) {
        const response = await this.client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
        });
        return response.choices[0].message.content;
    }
}

export default OpenAiAgent;