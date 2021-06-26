import express from "express";
import { readdir } from "fs/promises";
import { join } from "path";
import BaseRoute from "./BaseRoute";

export class App {
	public main = express();

	async start(config: {
		routesDir: string,
	}) {
		const PORT = process.env.PORT || 1010;

		this.main.listen(PORT, () => console.log(`Listening for API calls on port ${PORT}`));
		await this._loadRoutes(config.routesDir);
	}

	async _loadRoutes(routesDir: string) {
		const subDirs = await readdir(routesDir);

		for(const subDir of subDirs) {
			const files = await readdir(join(routesDir, subDir));

			for(const file of files) {
				const pseudoPull = await import(join(routesDir, subDir, file));

				const pull: BaseRoute = new pseudoPull.default(this);

				this.main.get(`/${subDir.toLowerCase()}/${pull.name}`, async (...args) => {
					pull.run(...args);
				});

				console.info(`Loaded command ${pull.name}`);
			}
		}
	}
};