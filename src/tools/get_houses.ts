import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { pc } from "../config/pinecone";

export const getHousesTool = tool(
  async ({ searchText }: { searchText: string }): Promise<string> => {
    const index = pc.index("habi").namespace("scrapper");
    const result = JSON.stringify(await index.searchRecords({
      query: {
        topK: 4,
        inputs: { text: searchText }
      }
    }));
    console.log(searchText)
    return result;
  },
  {
    name: "getHouses",
    description: "Permite obtener información de inmuebles basada en un texto",
    schema: z.object({
      searchText: z.string(),
    }),
  }
);
