import { RagService } from "../Service/RagService";
import { Ollama, OllamaEmbeddings, OllamaInput } from "@langchain/ollama";
import { MongoDBSaver } from "@langchain/langgraph-checkpoint-mongodb";
import { MongoClient } from "mongodb";
import { VectorStoreService } from "../Service/VectorStoreService";
import { ChatHistoryService } from "../Service/ChatHistoryService";

export class OllamaSession {
    public ollama: Ollama;
    public embeddings: OllamaEmbeddings;
    public checkpointer: MongoDBSaver;
    public ragService: RagService;

    constructor(input: OllamaInput, embeddingModel: string, mongoClient: MongoClient) {
        this.ollama = new Ollama(input);
        this.embeddings = new OllamaEmbeddings({
            model: embeddingModel,
            baseUrl: input.baseUrl,
        });

        // 確保 MongoClient 連線
        mongoClient.connect();

        // 正確傳遞 DB 給 MongoDBSaver
        this.checkpointer = new MongoDBSaver({ client: mongoClient as unknown as any, dbName: "411631269" });

        // ✅ 初始化 RAG 服務（需要 VectorStoreService & ChatHistoryService）
        const vectorStoreService = new VectorStoreService(embeddingModel);
        const chatHistoryService = new ChatHistoryService(mongoClient);
        this.ragService = new RagService(vectorStoreService, chatHistoryService);
    }

    public async testVector() {
        await this.ragService.testVectorStore();
    }
}