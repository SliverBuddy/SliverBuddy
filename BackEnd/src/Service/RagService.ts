import { VectorStoreService } from "./VectorStoreService";
import { ChatHistoryService } from "./ChatHistoryService";
import { Ollama } from "@langchain/ollama";
import { RagRequest } from "../interfaces/RagRequest";
import { Document } from "@langchain/core/documents";

export class RagService {
    private vectorStore: VectorStoreService;
    private chatHistory: ChatHistoryService;
    private ollama: Ollama;

    constructor(vectorStore: VectorStoreService, chatHistory: ChatHistoryService, model: string = "mistral") {
        this.vectorStore = vectorStore;
        this.chatHistory = chatHistory;
        this.ollama = new Ollama({ model }); // ✅ 讓模型名稱可配置
    }

    // ✅ 透過 RAG 查詢文件
    async askWithDocs(request: RagRequest, session: any) {
        try {
            // 1️⃣ 搜尋相關文件
            const docs = await this.vectorStore.search(request.question);
            const docContent = docs.length > 0 ? docs.map(doc => doc.pageContent).join("\n") : "沒有找到相關資料";

            // 2️⃣ 準備傳給 Ollama 的訊息
            const messages = [
                { role: "system", content: "你是一個知識豐富的 AI 助手。" },
                { role: "user", content: `問題：${request.question}\n相關文件：${docContent}` }
            ];

            // ✅ 轉換成適合 Ollama 的格式
            const formattedMessage = messages.map(msg => `${msg.role}: ${msg.content}`).join("\n");

            // 3️⃣ 傳送至 Ollama
            const response = await this.ollama.call(formattedMessage);

            // 4️⃣ 存入對話歷史
            if (!session.sessionId) {
                throw new Error("Session ID is missing");
            }

            await this.chatHistory.saveMessage({
                sessionId: session.sessionId,
                userMessage: request.question,
                botResponse: response,
                timestamp: new Date()
            });

            return response;
        } catch (error) {
            console.error("askWithDocs 發生錯誤:", error);
            throw new Error("RAG 服務失敗");
        }
    }

    // ✅ 測試向量存儲
    async testVectorStore() {
        try {
            const docs = [
                new Document({ pageContent: "This is a test document", metadata: { sid: "test123" } })
            ];
            await this.vectorStore.addDocuments(docs);

            const result = await this.vectorStore.search("test");
            console.log("Vector Store Result:", result);
            return result;
        } catch (error) {
            console.error("testVectorStore 發生錯誤:", error);
            throw new Error("測試向量存儲失敗");
        }
    }
}