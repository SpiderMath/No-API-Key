import { Request, Response } from "express";
import { readFileSync } from "fs";
import { EndpointConfig } from "../Types/RouterConfig";
import App from "./App";

export default abstract class BaseEndpoint {
	public app: App;
	public name: string = "";
	public description: string = "";
	public adminOnly: boolean = false;

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

	loadJSON(path: string) {
		return JSON.parse(readFileSync(path).toString());
	}

	// eslint-disable-next-line no-unused-vars
	abstract run(req: Request, res: Response): Promise<any>;
};