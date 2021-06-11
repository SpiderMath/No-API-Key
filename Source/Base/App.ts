import express from "express";
import Logger from "../Helpers/Logger";

export default class App {
	public port: number;
	private app = express();
	// @ts-ignore
	public logger: Logger = new Logger();

	constructor(port?: number) {
		this.logger.start();
		this.port = port || 6969;
	}

	async start() {
		this.app.listen(this.port, () => this.logger.success("app/server", `Listening for API Calls on port: ${this.port}`));
	}
};