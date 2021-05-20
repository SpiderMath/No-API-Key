import Express from "express";
import Logger from "../Helpers/Logger";
import { serve, setup } from "swagger-ui-express";
import swaggerJSDoc, { Options } from "swagger-jsdoc";
import { join } from "path";
import { readdirSync } from "fs";
import RouterExport from "../Constants/Router";

const swaggerOptions: Options = {
	swaggerDefinition: {
		info: {
			title: "No API Key",
			version: "Beta",
			description: "Confuzzled",
		},
	},
	apis: [
		join(__dirname, "../Routers/*.js"),
	],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

class App {
	public Router;
	public logger = Logger;

	constructor() {
		this.Router = Express();
	}

	public start(port: number) {
		this
			.Router
			.listen(port, () => this.logger.success("server", `Listening to API Calls in port: ${port}!`))
			.on("error", (err) => this.logger.error("server", `${err.message}`));

		this
			.Router
			.use("/documentation", serve, setup(swaggerDocs));

		readdirSync(join(__dirname, "../Routers/"))
			.forEach(async (file) => {
				const pseudoPull = await import(join(__dirname, "../Routers", file));

				const pull: RouterExport = pseudoPull.default;

				this.Router.use(`/${pull.name}`, pull.router);
			});
	}
};

export default App;