import { VectorStoreService } from "./VectorStoreService";
import { ChatHistoryService } from "./ChatHistoryService";
import { Ollama } from "@langchain/ollama";
import { RagRequest } from "../interfaces/RagRequest";

export class RagService {
    private vectorStore: VectorStoreService;
    private chatHistory: ChatHistoryService;
    private ollama: Ollama;

    constructor(vectorStore: VectorStoreService, chatHistory: ChatHistoryService) {
        this.vectorStore = vectorStore;
        this.chatHistory = chatHistory;
        this.ollama = new Ollama({ model: "mistral" });
    }

    async askWithDocs(request: RagRequest) {
        // 1️⃣ 搜尋相關文件
        const docs = await this.vectorStore.search(request.question);
        const docContent = docs.map(doc => doc.pageContent).join("\n");

        // 2️⃣ 使用 LLM 回答
        const messages = [
            { role: "system", content: "你是一個知識豐富的 AI 助手。" },
            { role: "user", content: `問題：${request.question}\n相關文件：${docContent}` }
        ];
        const response = await this.ollama.chat({ messages });

        // 3️⃣ 存入對話歷史
        await this.chatHistory.saveMessage({
            sessionId: request.sessionId,
            userMessage: request.question,
            botResponse: response,
            timestamp: new Date()
        });

        return response;
    }
}
