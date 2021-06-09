import express from "express";
import Logger from "../Helpers/Logger";

export default class App {
	public port: number;
	private app = express();
	public logger = Logger;

	constructor(port?: number) {
		this.port = port || 6969;
	}

	async start() {
		this.app.listen(this.port, () => this.logger.success("app/server", `Listening for API Calls on port: ${this.port}`));
	}
};