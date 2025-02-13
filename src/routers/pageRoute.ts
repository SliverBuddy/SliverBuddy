import { Route } from "../abstract/Route";
import { PageController } from '../controller/pageController';

// 在這裡將 Route 泛型參數設為 PageController
export class PageRoute extends Route<PageController> {

    protected url: string;
    protected controller = new PageController(); // 確保 controller 是 PageController 類型

    constructor() {
        super();
        this.url = '/';
        this.setRoutes();
    }

    protected setRoutes(): void {
        this.router.get(`${this.url}`, (req, res) => {
            this.controller.sendPage(req, res); // 使用 controller
        });
    }
}