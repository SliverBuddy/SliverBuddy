import { Route } from "./abstract/Route";
import { PageRoute } from "./routers/pageRoute";
import { UserRoute } from "./routers/UserRoute";
import { RagRoute } from "./routers/RagRoutes"; // 確保大小寫一致

export const router: Array<Route<any>> = [
    new PageRoute(),
    new UserRoute(),
    new RagRoute(), // 註冊 RAG API
];