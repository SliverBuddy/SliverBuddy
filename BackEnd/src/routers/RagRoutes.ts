import { Route } from "../abstract/Route";
import { RagController } from "../controller/RagController";
import { RagService } from "../Service/RagService";
import { Application, Request, Response } from "express";

export class RagRoute extends Route {
    protected url = "/api/rag"; // ✅ 設定 API 前綴
    protected controller = new RagController(new RagService()); // ✅ 初始化 Controller 並傳入 RagService

    protected setRoutes(): void {
        this.router.post(`${this.url}/ask`, (req: Request, res: Response) => {
            this.controller.askWithDocs(req, res);
        });
    }
}