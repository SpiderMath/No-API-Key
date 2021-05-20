import { Request, Response } from "express";

interface RouteExport {
	name: string,
	type?: "get" | "post" | "put" | "delete",
	parameters: Parameter[],
	description: string,
	run: RunFunction,
};

interface Parameter {
	name: string,
	description: string,
	type: string,
	required: boolean,
};

interface RunFunction {
	// eslint-disable-next-line no-unused-vars
	(req: Request, res: Response): Promise<any>
};

export default RouteExport;