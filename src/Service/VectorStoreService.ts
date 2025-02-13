import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OllamaEmbeddings } from "@langchain/ollama";
import { Document } from "@langchain/core/documents";

export class VectorStoreService {
    private vectorStore: MemoryVectorStore;

    constructor(embeddingModel: string) {
        const embeddings = new OllamaEmbeddings({ model: embeddingModel });
        this.vectorStore = new MemoryVectorStore(embeddings);
    }

    async addDocuments(docs: Document<Record<string, any>>[]) {
        await this.vectorStore.addDocuments(docs);
    }

    async search(query: string) {
        return await this.vectorStore.similaritySearch(query, 3);
    }
}