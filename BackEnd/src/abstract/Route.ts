import { Router } from "express";
import { Contorller } from "../abstract/Contorller"; // 修正拼字

export abstract class Route {
    
    protected abstract url: string; // API 路徑
    protected abstract controller: Contorller; // 修正命名

    protected router = Router();

    constructor() {
        this.setRoutes(); // ✅ 自動設定路由
    }

    // ✅ 讓子類別定義 API 路由
    protected abstract setRoutes(): void;

    // ✅ 取得 router，讓 `app.ts` 註冊
    public getRouter() {
        return this.router;
    }

    // ✅ 取得 URL，方便管理
    public getUrl() {
        return this.url;
    }
}