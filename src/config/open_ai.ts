import { ChatOpenAI } from "@langchain/openai";

const openAikey = process.env.OPENAI_KEY;

const openai = new ChatOpenAI({
    apiKey: openAikey,
    model: "gpt-4o"
});

export default openai;