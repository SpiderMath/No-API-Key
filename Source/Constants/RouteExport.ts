import { Request, Response } from "express";

interface RunFunction {
	// eslint-disable-next-line no-unused-vars
	(req: Request, res: Response): Promise<any>
}

interface ParamDescription {
	name: string,
	required?: boolean,
	description: string,
	type: string,
};

interface RouteExport {
	name: string,
	description: string,
	params: ParamDescription[],
	run: RunFunction,
};

export default RouteExport;