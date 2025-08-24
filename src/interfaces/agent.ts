class Agent {

    async invokeAgent(prompt: string, config: { thread_id: string }): Promise<{ id: string, message: string }> {
        throw new Error("Not implemented");
    }

}

export default Agent;
