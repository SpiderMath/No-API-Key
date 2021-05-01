import { Router } from "express";
import { readdirSync } from "fs";
import { join } from "path";
import RouteExport from "../Constants/RouteExport";
import Logger from "./Logger";

export default function LoadRoutes(folderName: string, router: Router, routerName: string) {
	readdirSync(`${__dirname}/../Routes/${folderName}`)
		.filter(fName => fName.endsWith(".ts"))
		.forEach(async (fileName: string) => {
			const pseudoPull = await import(join(__dirname, `../Routes/${folderName}/${fileName}`));

			const pull: RouteExport = pseudoPull.default;

			router.use(`/${pull.name.toLowerCase()}`, pull.run);
			Logger.success(`server/routes/${routerName}`, `Loaded /${pull.name.toLowerCase()}`);
		});
};