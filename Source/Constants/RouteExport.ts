import { Request, Response } from "express";
import App from "../Classes/App";

interface RouteExport {
	name: string,
	description: string,
	parameters: Parameter[],
	admin: true | false,
	type?: "get" | "post" | "put" | "delete",
	run: RunFunction,
};

interface Parameter {
	name: string,
	description: string,
	type: "string" | "number" | "boolean",
	required: boolean,
};

interface RunFunction {
	// eslint-disable-next-line no-unused-vars
	(req: Request, res: Response, app: App): Promise<any>
};

export default RouteExport;