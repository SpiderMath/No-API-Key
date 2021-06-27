import express, { Router } from "express";
import { appendFile, readdir } from "fs/promises";
import { join } from "path";
import BaseRoute from "./BaseRoute";
import Util from "../Helpers/Util";
import { v4 } from "uuid";
import Logger from "../Helpers/Logger";
import { Collection } from "@discordjs/collection";

export class App {
	public main = express();
	public util = new Util();
	public adminKey = v4();
	public logger = new Logger();
	private routeCache: Collection<string, BaseRoute> = new Collection();

	async start(config: {
		routesDir: string,
	}) {
		const PORT = process.env.PORT || 1010;

		this.main.listen(PORT, () => this.logger.success("server", `Listening for API calls on port ${PORT}`));
		await appendFile(join(__dirname, "../../.env"), `\nKEY=${this.adminKey}`);
		await this._loadRoutes(config.routesDir);
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
};