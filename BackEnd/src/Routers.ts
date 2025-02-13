import { Route } from "./abstract/Route";
import { PageRoute } from "./routers/pageRoute";
import { UserRoute } from "./routers/UserRoute";
import { RagRoute } from "./routers/RagRoutes"; // ✅ 新增 RAG API

export const router: Array<Route> = [
    new PageRoute(),
    new UserRoute(),
    new RagRoute(), // ✅ 註冊 RAG API
];