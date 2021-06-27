import { Response } from "express";
import { readFile } from "fs/promises";

export default class Util {
	successJSON(res: Response, json: object) {
		return res
			.status(200)
			.json({
				data: json,
				error: false,
			});
	}

	badRequest(res: Response, error: string) {
		return res
			.status(400)
			.json({
				error: true,
				message: error,
			});
	}

	successImage(res: Response, buffer: Buffer, mime: "image/png" | "image/jpeg" = "image/png") {
		return res
			.set({ "Content-Type": mime })
			.status(200)
			.send(buffer);
	}

	async readJSON(path: string) {
		const buffer = await readFile(path);

		return JSON.parse(buffer.toString());
	}
};