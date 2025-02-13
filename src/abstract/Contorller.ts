import { Request, Response } from "express";
import { Service } from "./Service"; // 確保 Service 已正確引入

export abstract class Contorller {
    protected abstract service: Service; // 這裡定義 service 屬性

    constructor() {}
}