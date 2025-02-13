import { Request, Response } from "express";
import { RagService } from "../Service/RagService";
import { RagRequest } from "../interfaces/RagRequest";

export class RagController {
    private ragService: RagService;

    constructor(ragService: RagService) {
        this.ragService = ragService;
    }

    async askWithDocs(req: Request, res: Response) {
        const request: RagRequest = req.body;

        try {
            const response = await this.ragService.askWithDocs(request);
            res.json({ reply: response });
        } catch (error) {
            console.error("RAG 錯誤:", error);
            res.status(500).json({ error: "RAG 服務失敗" });
        }
    }
}