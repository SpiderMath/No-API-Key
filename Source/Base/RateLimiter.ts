import Collection from "@discordjs/collection";
import { NextFunction, Request, Response } from "express";
import App from "./App";

export default class RateLimitManager {
	public rateLimitCache: Collection<string, number> = new Collection();
	public app: App;
	private throttle: number;

	constructor(app: App, config: { throttle: number, cacheClear: number }) {
		this.app = app;
		this.throttle = config.throttle;

		setInterval(() => {
			this.rateLimitCache.clear();
		}, config.cacheClear);
	}

	public async rateLimiter(req: Request, res: Response, next: NextFunction) {
		const ip = req.header("x-forwarded-for") || req.socket.remoteAddress;

		// @ts-ignore
		let numberOfRequests = this.rateLimitCache.get(ip);
		if(!numberOfRequests) {
			// @ts-ignore
			this.rateLimitCache.set(ip, 1);
			numberOfRequests = 1;
		}
		else {
			// @ts-ignore
			this.rateLimitCache.set(ip, numberOfRequests + 1);
		}

		if(numberOfRequests > this.throttle) {
			return res
				.status(429)
				.json({
					error: true,
					message: "Too many requests!",
				});
		}

		next();
	}
};