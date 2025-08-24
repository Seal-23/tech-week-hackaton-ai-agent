import OpenAI from 'openai';

const openAikey = process.env.OPENAI_KEY;

const openai = new OpenAI({
    apiKey: openAikey,
});

export default openai;