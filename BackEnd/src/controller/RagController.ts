import { RagService } from "../Service/RagService";
import { Contorller } from "../abstract/Contorller";
import { Request, Response } from "express";

export class RagController extends Contorller {
    protected service: RagService;

    constructor(service: RagService) {
        super();
        this.service = service;
    }

    // ✅ 透過 RAG 查詢文件
    async askWithDocs(req: Request, res: Response) {
        const { question, session } = req.body; // 明確解構 request.body

        if (!question || !session) {
            return res.status(400).json({ error: "請提供 question 和 session" });
        }

        try {
            const response = await this.service.askWithDocs(question, session);
            res.json({ reply: response });
        } catch (error) {
            console.error("RAG 錯誤:", error);
            res.status(500).json({ error: "RAG 服務失敗" });
        }
    }

    // ✅ 測試向量存儲
    async testVectorStore(req: Request, res: Response) {
        try {
            const result = await this.service.testVectorStore();
            res.json({ message: "Vector Store Test Completed!", data: result });
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: "向量存儲測試失敗", details: error.message });
            } else {
                res.status(500).json({ error: "向量存儲測試失敗", details: String(error) });
            }
        }
    }
}   