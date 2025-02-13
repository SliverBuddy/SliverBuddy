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
    protected controller: RagController;  // 這裡使用 RagController 類型

    constructor() {
        super();

        // 初始化服務
        const vectorStoreService = new VectorStoreService("mistral");
        const chatHistoryService = new ChatHistoryService(mongoClient);
        const ragService = new RagService(vectorStoreService, chatHistoryService);

        // 初始化 controller 並將 service 傳入
        this.controller = new RagController(ragService);
    }

    protected setRoutes(): void {
        this.router.post(`${this.url}/ask`, (req: Request, res: Response) => {
            this.controller.askWithDocs(req, res);
        });
    }
}