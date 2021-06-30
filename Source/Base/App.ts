import express, { Router } from "express";
import { appendFile, readdir } from "fs/promises";
import { join } from "path";
import BaseRoute from "./BaseRoute";
import Util from "../Helpers/Util";
import { v4 } from "uuid";
import Logger from "../Helpers/Logger";
import SuperMap from "./SuperMap";

export class App {
	public main = express();
	public util = new Util();
	public adminKey = v4();
	public logger = new Logger();
	private routeCache: SuperMap<string, BaseRoute> = new SuperMap();

	async start(config: {
		routesDir: string,
	}) {
		const PORT = process.env.PORT || 1010;

		this.main.listen(PORT, () => this.logger.success("server", `Listening for API calls on port ${PORT}`));
		await appendFile(join(__dirname, "../../.env"), `\nKEY=${this.adminKey}`);
		await this._loadRoutes(config.routesDir);
		await this._loadDocs();
	}

	async _loadRoutes(routesDir: string) {
		const subDirs = await readdir(routesDir);
		const subRouteList: any = await this.util.readJSON(join(__dirname, "../../Assets/JSON/APISubroutes.json"));
		const APIRouter = Router();

		for(const subDir of subDirs) {
			const files = await readdir(join(routesDir, subDir));

			for(const file of files) {
				const pseudoPull = await import(join(routesDir, subDir, file));

				const pull: BaseRoute = new pseudoPull.default(this);
				const APISubRoute = subRouteList[subDir.toLowerCase()] || subDir.toLowerCase();
				pull.category = APISubRoute;

				APIRouter.get(`/${APISubRoute}/${pull.name}`, async (req, res, next) => {
					if(pull.adminOnly && (!req.query.key || req.query.key !== this.adminKey)) return this.util.badRequest(res, "This is an admin only endpoint!");

					pull.run(req, res, next);
				});

				this.routeCache.set(pull.name, pull);
				this.logger.success("server/routes", `Loaded Route /${APISubRoute}/${pull.name} successfully!`);
			}
		}

		this.main.use("/api", APIRouter);
	}

	async _loadDocs() {
		const DocsRouter = Router();
		const categories = [...new Set(this.routeCache.map(route => route.category))];

		DocsRouter.get("/:cat/:route", (req, res) => {
			const category = req.params.cat;
			if(!categories.includes(category.toLowerCase())) return this.util.badRequest(res, "Invalid category");

			const routes = this.routeCache.filter(route => route.category === category.toLowerCase());
			const route = routes.get(req.params.route);

			if(!route) return this.util.badRequest(res, "Page not found");

			this.util.successJSON(res, {
				name: route.name,
				description: route.description,
				parameters: route.parameters,
				subRouteOf: route.category,
				adminOnly: route.adminOnly,
			});
		});

		this.main.use("/docs", DocsRouter);
	}
};