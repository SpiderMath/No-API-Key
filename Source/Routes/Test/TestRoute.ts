import App from "../../Base/App";
import BaseRoute from "../../Base/BaseRoute";
import { Request, Response } from "express";

export default class TestRoute extends BaseRoute {
	constructor(app: App) {
		super(app, {
			name: "test",
			description: "This is a Test Endpoint",
			adminOnly: true,
		});
	}

	async run(req: Request, res: Response, obj: any) {
		res.send(obj.something);
	}
}