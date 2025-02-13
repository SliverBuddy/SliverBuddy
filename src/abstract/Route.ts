import { Router } from "express";
import { Contorller } from "../abstract/Contorller"; // 修正拼字

export abstract class Route<T extends Contorller> {
    
    protected abstract url: string; // API 路徑
    protected abstract controller: T; // 使用泛型來指定 Controller 類型

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