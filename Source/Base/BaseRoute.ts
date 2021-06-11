import { Request, Response } from "express";
import { EndpointConfig } from "../Types/RouterConfig";
import App from "./App";

export default abstract class BaseRoute {
	public app: App;
	public name: string = "";
	public description: string = "";
	public adminOnly: boolean = false;
	public category: string = "";

	constructor(app: App, config: EndpointConfig) {
		this.app = app;

		Object
			.assign(
				this,
				config,
			);

		Object
			.defineProperty(
				this,
				"app",
				{
					configurable: true,
					enumerable: false,
					writable: true,
				},
			);
	}

	// eslint-disable-next-line no-unused-vars
	abstract run(req: Request, res: Response): Promise<any>;
};