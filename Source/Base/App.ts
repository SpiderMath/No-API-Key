import express, { Request, Response, Router } from "express";
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

				const object: object = {};

				const params = route.parameters.filter(param => param.required);

				for(const param of params) {
					let val: any = req.query[param.name];

					if(!val) return res.status(400).json({ error: true, message: `No value provided for ${param.name}` });

					if(param.type === "number") {
						val = Number(val);
						if(!val) return res.status(400).json({ error: true, message: `Invalid number provided for ${param.name}` });

						Object
							.defineProperty(
								object,
								param.name,
								{
									configurable: true,
									writable: true,
									enumerable: false,
									value: val,
								},
							);
					}
					else if(param.type === "boolean") {
						if(["t", "true"].includes(val.toLowerCase())) val = true;
						else if(["f", "false"].includes(val.toLowerCase())) val = false;
						else return res.status(400).json({ error: true, message: `Invalid option provided for boolean parameter ${param.name}` });

						Object
							.defineProperty(
								object,
								param.name,
								{
									configurable: true,
									writable: true,
									enumerable: false,
									value: val,
								},
							);
					}
					else {
						Object
							.defineProperty(
								object,
								param.name,
								{
									configurable: true,
									writable: true,
									enumerable: false,
									value: val,
								},
							);
					}
				}

				const unreqedParams = route.parameters.filter(param => !param.required);

				for(const param of unreqedParams) {
					let val: any = req.query[param.name];

					if(!val) continue;

					if(param.type === "number") {
						val = Number(val);
						if(!val) return res.status(400).json({ error: true, message: `Invalid number provided for ${param.name}` });

						Object
							.defineProperty(
								object,
								param.name,
								{
									configurable: true,
									writable: true,
									enumerable: false,
									value: val,
								},
							);
					}
					else if(param.type === "boolean") {
						if(["t", "true"].includes(val.toLowerCase())) val = true;
						else if(["f", "false"].includes(val.toLowerCase())) val = false;
						else return res.status(400).json({ error: true, message: `Invalid option provided for boolean parameter ${param.name}` });

						Object
							.defineProperty(
								object,
								param.name,
								{
									configurable: true,
									writable: true,
									enumerable: false,
									value: val,
								},
							);
					}
					else {
						Object
							.defineProperty(
								object,
								param.name,
								{
									configurable: true,
									writable: true,
									enumerable: false,
									value: val,
								},
							);
					}
				}
				route
					.run(req, res, object);
			});

		APIRouter
			.use((req: Request, res: Response) => {
				res
					.status(404)
					.json({
						error: true,
						message: "Endpoint not found",
					});
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