import express, { Response, Router } from "express";
import { readdir } from "fs/promises";
import { join } from "path";
import Logger from "../Helpers/Logger";
import RouteManager from "./RouteManager";
import BaseRoute from "./BaseRoute";
import { readFileSync } from "fs";

export default class App {
	public port: number;
	private app = express();
	public logger: Logger = new Logger();
	public routes = new RouteManager();

	constructor(port?: number) {
		this.logger.start();
		this.port = port || 6969;
	}

	async start() {
		this.app.listen(this.port, () => this.logger.success("app/server", `Listening for API Calls on port: ${this.port}`));
		await this.loadEndpoints();
		const APIRouter = await this.APIRouter();
		this.app.use(APIRouter);
	}

	async APIRouter(): Promise<Router> {
		const APIRouter = Router();

		APIRouter
			.get("/:cat/:endpoint", (req, res) => {
				const endpoint = req.params.endpoint;
				const category = req.params.cat;

				const route = this.routes.get(endpoint.toLowerCase());
				if(!route) return this.pageNotFound(res);

				if(route.category !== category.toLowerCase()) return this.pageNotFound(res);

				route
					.run(req, res);
			});
		return APIRouter;
	}

	async loadEndpoints() {
		const subDirs = await readdir(join(__dirname, "../Routes"));
		const RouteMap = this.loadJSON(join(__dirname, "../../Assets/JSON/RouteMap.json"));

		for(const subDir of subDirs) {
			const files = await readdir(join(__dirname, "../Routes", subDir));
			this.logger.info("server/routes", `Loading sub directory ${subDir}`);

			for(const file of files) {
				const pseudoPull = await import(join(__dirname, "../Routes", subDir, file));
				const pull = new pseudoPull.default(this) as BaseRoute;

				pull.category = RouteMap[subDir.toLowerCase()] || subDir.toLowerCase();

				this.routes.register(pull.name, pull);
				this.logger.success("server/routes", `Loaded route ${pull.name}`);
			}
		}
	}

	public loadJSON(path: string) {
		return JSON.parse(readFileSync(path).toString());
	}

	public pageNotFound(res: Response) {
		res
			.status(404)
			.json({
				error: true,
				message: "Page not found",
			});
	}
};