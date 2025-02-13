import { Route } from "../abstract/Route";
import { UserController } from "../controller/UserController";
import { logger } from "../middlewares/log";

// 在這裡將 Route 泛型參數設為 UserController
export class UserRoute extends Route<UserController> {

    protected url: string;
    protected controller = new UserController(); // 確保 controller 是 UserController 類型

    constructor() {
        super();
        this.url = '/api/v1/user/';
        this.setRoutes();
    }

    protected setRoutes(): void {

        this.router.get(`${this.url}findAll`, (req, res) => {
            this.controller.findAll(req, res); // 使用 controller，而不是 Contorller
        });

        /**
         * 新增學生
         * request body {
         *  userName: string,
         *  name: string,
         *  department: string,
         *  grade: string,
         *  class: string,
         *  Email: string
         * } 
         * @returns resp<Student>
         */
        this.router.post(`${this.url}insertOne`, (req, res) => {
            this.controller.insertOne(req, res); // 使用 controller，而不是 Contorller
        });
    }
}
