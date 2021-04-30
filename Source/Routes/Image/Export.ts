import { Request, Response } from "express";

const e = {
	name: "e",
	run(req: Request, res: Response) {
		res.send("e");
	},
};

export default e;