import express, { Router } from "express";
import Logger from "../Helpers/Logger";

export default class App {
	public port: number;
	private app = express();
	public logger: Logger = new Logger();

	constructor(port?: number) {
		this.logger.start();
		this.port = port || 6969;
	}

	async start() {
		this.app.listen(this.port, () => this.logger.success("app/server", `Listening for API Calls on port: ${this.port}`));
		const APIRouter = await this.APIRouter();
		this.app.use(APIRouter);
	}

	async APIRouter(): Promise<Router> {
		const APIRouter = Router();

		APIRouter
			.get("/:cat/:endpoint", (req, res) => {
				const endpoint = req.params.endpoint;
				const category = req.params.cat;
			});
		return APIRouter;
	}
};