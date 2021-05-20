import express from "express";
import { readdirSync } from "fs";
import { join } from "path";
import RouteExport from "./Constants/RouteExport";
import RouterExport from "./Constants/RouterExport";
import Logger from "./Helpers/Logger";

const port = 6969;

const app = express();

app.listen(port, () => Logger.success("server", `Listening for API Calls on port: ${port}!`));

// Load Routers & Routes
readdirSync(join(__dirname, "Routers"))
	.forEach(async (file) => {
		const pseudoPull = await import(join(__dirname, "Routers", file));

		const pull: RouterExport = pseudoPull.default;

		readdirSync(join(__dirname, "Routes", pull.routesDir))
			.forEach(async (routeFile) => {
				const pseudoRoute = await import(join(__dirname, `Routes/${pull.routesDir}/${routeFile}`));

				const Route: RouteExport = pseudoRoute.default;

				if(!Route.type) Route.type = "get";

				console.log(Route);
				pull.router[Route.type](`/${Route.name}`, Route.run);
			});

		app.use(`/${pull.name}`, pull.router);
		Logger.success("server/routers", `Loaded Router: ${pull.name}`);
	});