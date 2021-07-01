import express from "express";
import Logger from "../Helpers/Logger";

export default class App {
	public main;
	private port: number;
	public logger = new Logger();

	constructor() {
		this.main = express();
		this.port = Number(process.env.PORT) || 1010;

		this.main.listen(this.port, () => this.logger.success("server", `Listening for API Calls on port: ${this.port}`));
	}
};