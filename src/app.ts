import express from 'express';
import { router } from "./Routers"; // ✅ 確保正確載入
import { logger } from './middlewares/log';
import http from 'http';
import cors from 'cors';
import { MongoDB } from './utils/MongoDB';
import dotenv from 'dotenv';

dotenv.config(); // ✅ 確保載入 .env

const app: express.Application = express();
const server = http.createServer(app);

// ✅ 檢查環境變數，避免 undefined 問題
const PORT = process.env.PORT || 3000;
const DB_CONFIG = {
  name: process.env.DBUSER || '',
  password: process.env.DBPASSWORD || '',
  host: process.env.DBHOST || 'localhost',
  port: process.env.DBPORT || '27017',
  dbName: process.env.DBNAME || 'test'
};

// ✅ 初始化 MongoDB 連線
export const DB = new MongoDB(DB_CONFIG);

// ✅ 設定 CORS
app.use(cors({
  origin: "*", // 可設定特定網域
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 200,
  exposedHeaders: ['Content-Disposition']
}));

// ✅ 設定 Body Parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false }));

// ✅ 設定靜態資源
const assetsPath = process.env.ASSETS_PATH || 'public';
app.use('/assets', express.static(assetsPath));

// ✅ 自動註冊所有路由
for (const route of router) {
  app.use(route.getUrl(), route.getRouter());
}

// ✅ 啟動 HTTP 伺服器
server.listen(PORT, () => {
  logger.info(`🚀 Server running on http://localhost:${PORT}`);
});