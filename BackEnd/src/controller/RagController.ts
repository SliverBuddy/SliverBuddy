import { RagService } from "../Service/RagService"; // 引入 RagService
import { Contorller } from "../abstract/Contorller"; // 引入 Contorller
import { Request, Response } from "express";

export class RagController extends Contorller {
    // 定義 service 屬性，並確保它是 RagService 類型
    protected service: RagService;

    constructor(service: RagService) {
        super(); // 呼叫父類建構函式
        this.service = service; // 初始化 service 屬性
    }

    async askWithDocs(req: Request, res: Response) {
        const request = req.body;

        try {
            const response = await this.service.askWithDocs(request);
            res.json({ reply: response });
        } catch (error) {
            console.error("RAG 錯誤:", error);
            res.status(500).json({ error: "RAG 服務失敗" });
        }
    }
}