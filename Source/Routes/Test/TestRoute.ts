import { Request, Response } from "express";
import { App } from "../../Base/App";
import BaseRoute from "../../Base/BaseRoute";

export default class TestRoute extends BaseRoute {
	constructor(app: App) {
		super(app, {
			name: "test",
			description: "This is a test route!",
			adminOnly: true,
		});
	}

	async run(req: Request, res: Response) {
		return res.send("Test working for some weird reason");
	}
};