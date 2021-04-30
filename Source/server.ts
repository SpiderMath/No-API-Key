import express from "express";
import Logger from "./Helpers/Logger";
import fs from "fs";
import path from "path";
import RouterExport from "./Constants/RouterExport";

const app = express();

const port = 6969;

app.listen(port, () => Logger.success("server", `Listening to API Calls on port ${port}!`));

app.get("/", (req, res) => {
	res.send("<b>Hello World!</b>");
});

fs
	.readdirSync(path.join(__dirname, "../Source/Routers"))
	.filter(fName => fName.endsWith(".ts"))
	.forEach(async (fileName: string) => {
		const pseudoPull = await import(path.join(__dirname, `../Source/Routers/${fileName}`));

		const pull: RouterExport = pseudoPull.default;

		app.use(`/${pull.name}`, pull.router);
		Logger.info("server/routers", `Loading routes from router on /${pull.name}`);
	});