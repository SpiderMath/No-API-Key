import express from "express";
import { readdirSync } from "fs";
import Logger from "../Helpers/Logger";
import { DirectoryMap } from "../Config/DirectoryMap";
import RouteExport from "../Constants/RouteExport";
import { Collection } from "../Packages/Collection";
import { v4 } from "uuid";
import { join } from "path";

export default class App {
	private main = express();
	public logger = Logger;
	private port: number;
	public routes: Collection<string, RouteExport> = new Collection();
	public adminKey: string = v4();

	constructor(port: number = 6969) {
		this.port = port;

		this.main.listen(this.port, () => this.logger.success("server", `Listening for API Calls on port: ${port}!`));

		this._loadRoutes();
	}

	private _loadRoutes() {
		readdirSync(join(__dirname, "../Routes"))
			.forEach(async (dir: string) => {
				const files = readdirSync(join(__dirname, `../Routes/${dir}`));
				// @ts-ignore
				let endpointPath: string = DirectoryMap[dir];
				if(!endpointPath) endpointPath = dir;

				for(const file of files) {
					const pseudoPull = await import(join(__dirname, `../Routes/${dir}/${file}`));

					const pull: RouteExport = pseudoPull.default;

					if(!pull.type) pull.type = "get";
					this.routes.set(`/${endpointPath.toLowerCase()}/${pull.name.toLowerCase()}`, pull);

					this.main[pull.type](`/${endpointPath.toLowerCase()}/${pull.name.toLowerCase()}`, (req, res) => {
						const requiredFields = pull.parameters.filter(param => param.required);

						for(const param of requiredFields) {
							let query: any = req.query[param.name];

							if(!query) {
								return res
									.status(400)
									.send({
										error: true,
										reason: `${param.name} is not provided. [Parameter Type: ${param.type}]`,
									});
							}

							if(param.type === "number") query = Number(query);

							if(param.type === "boolean") {
								if(query.toLowerCase() === "true") { query = true; }
								else if(query.toLowerCase() === "false") { query = false; }
								else {
									return res
										.status(400)
										.send({
											error: true,
											reason: `Invalid parameter type for ${param.name}`,
										});
								}
							}

							if(!query) {
								return res
									.status(400)
									.send({
										error: true,
										reason: `Invalid parameter type for ${param.name}`,
									});
							}
						}

						pull.run(req, res, this);
					});

					this.logger.success("server/routes", `Loaded route /${endpointPath.toLowerCase()}/${pull.name.toLowerCase()} successfully!`);
				}
			});
	}
};