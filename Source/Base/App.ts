import express, { Request, Response, Router } from "express";
import { readdir, writeFile } from "fs/promises";
import { join } from "path";
import Logger from "../Helpers/Logger";
import RouteManager from "./RouteManager";
import BaseRoute from "./BaseRoute";
import { readFileSync } from "fs";
import { v4 as uuid } from "uuid";

export default class App {
	public port: number;
	private app = express();
	public logger: Logger = new Logger();
	public routes = new RouteManager();
	public baseURL: string = "";
	public adminKey = uuid();

	constructor(port?: number) {
		this.logger.start();
		this.port = port || 6969;
		this.baseURL = `example.com:${this.port}`;
	}

	async start() {
		this.app.listen(this.port, () => this.logger.success("app/server", `Listening for API Calls on port: ${this.port}`));
		await this.loadEndpoints();
		const APIRouter = await this.APIRouter();
		const DocsRouter = await this.DocsRouter();

		await writeFile(".env", `TOKEN=${this.adminKey}`);
		this.app.get("/", (req, res) => res.redirect("/docs"));

		this.app.use("/api", APIRouter);
		this.app.use("/docs", DocsRouter);
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

	public badRequest(res: Response, message: string) {
		res
			.status(400)
			.json({
				error: true,
				message,
			});
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
			.use((req: Request, res: Response) => this.pageNotFound(res));

		return APIRouter;
	}

	public DocsRouter() {
		const DocsRouter = Router();
		const categories: string[] = [];

		this.routes.cache
			.map(c => c.category)
			.forEach(c => {
				if(!categories.includes(c)) categories.push(c);
			});

		DocsRouter
			.get("/:cat/:endpoint", (req, res) => {
				const endpoint = req.params.endpoint;
				const category = req.params.cat;

				const route = this.routes.get(endpoint.toLowerCase());
				if(!route) return this.pageNotFound(res);

				if(route.category !== category.toLowerCase()) return this.pageNotFound(res);

				res
					.status(200)
					.json(
						route,
					);
			});

		DocsRouter
			.get("/", (req, res) => {
				res
					.status(200)
					.json(
						categories,
					);
			});

		DocsRouter
			.get("/:cat", (req, res) => {
				const category = req.params.cat;

				if(!categories.includes(category)) return res.status(400).send({ error: true, message: "Invalid category provided" });

				const resp: any = {};

				this.routes.cache.filter(r => r.category.toLowerCase() === category.toLowerCase()).map(route => resp[route.name] = route);

				res
					.status(200)
					.json(
						resp,
					);
			});
		DocsRouter
			.use((req: Request, res: Response) => this.pageNotFound(res));

		return DocsRouter;
	}
};