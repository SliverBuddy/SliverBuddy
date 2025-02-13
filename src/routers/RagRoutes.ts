import { Route } from "../abstract/Route";
import { RagController } from "../controller/RagController";
import { RagService } from "../Service/RagService";
import { VectorStoreService } from "../Service/VectorStoreService";
import { ChatHistoryService } from "../Service/ChatHistoryService";
import { MongoClient } from "mongodb";
import { Request, Response } from "express";

// 初始化 MongoClient
const mongoClient = new MongoClient("mongodb://localhost:27017");

export class RagRoute extends Route<RagController> {
    protected url = "/api/rag";
    protected controller: RagController;

    constructor() {
        super();

        const mongoUrl = "mongodb://localhost:27017"; // ✅ 這裡使用 URL 字串
        const vectorStoreService = new VectorStoreService(mongoUrl); // ✅ 傳入正確的 string
        const chatHistoryService = new ChatHistoryService(mongoClient); // ✅ 這裡保留 MongoClient
        const ragService = new RagService(vectorStoreService, chatHistoryService, "mistral");

        this.controller = new RagController(ragService);
    }

    protected setRoutes(): void {
        // ✅ 問答 API
        this.router.post(`${this.url}/ask`, (req: Request, res: Response) => {
            this.controller.askWithDocs(req, res);
        });

        // ✅ 測試向量存儲 API
        this.router.get(`${this.url}/test-vector`, (req: Request, res: Response) => {
            this.controller.testVectorStore(req, res); // ✅ 改為調用 `testVectorStore`
        });
    }
}
