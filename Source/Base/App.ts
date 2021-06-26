import express from "express";
import { appendFile, readdir } from "fs/promises";
import { join } from "path";
import BaseRoute from "./BaseRoute";
import Util from "../Helpers/Util";
import { v4 } from "uuid";

export class App {
	public main = express();
	public util = new Util();
	public adminKey = v4();

	async start(config: {
		routesDir: string,
	}) {
		const PORT = process.env.PORT || 1010;

		this.main.listen(PORT, () => console.log(`Listening for API calls on port ${PORT}`));
		await appendFile(join(__dirname, "../../.env"), `\nKEY=${this.adminKey}`);
		await this._loadRoutes(config.routesDir);
	}

	async _loadRoutes(routesDir: string) {
		const subDirs = await readdir(routesDir);

		for(const subDir of subDirs) {
			const files = await readdir(join(routesDir, subDir));

			for(const file of files) {
				const pseudoPull = await import(join(routesDir, subDir, file));

				const pull: BaseRoute = new pseudoPull.default(this);

				this.main.get(`/${subDir.toLowerCase()}/${pull.name}`, async (req, res, next) => {
					if(pull.adminOnly && (!req.query.key || req.query.key !== this.adminKey)) return this.util.badRequest(res, "This is an admin only endpoint!");

					pull.run(req, res, next);
				});

				console.info(`Loaded command ${pull.name}`);
			}
		}
	}
};