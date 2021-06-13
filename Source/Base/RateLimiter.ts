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

		let numberOfRequests;

		// @ts-ignore
		if(this.rateLimitCache.get(ip)) numberOfRequests = this.rateLimitCache.get(ip) + 1;
		else numberOfRequests = 1;

		// @ts-ignore
		if(numberOfRequests > this.throttle) {
			return res
				.status(429)
				.json({
					error: true,
					message: "Too many requests!",
				});
		}

		// @ts-ignore
		this.rateLimitCache.set(ip, numberOfRequests);

		next();
	}
};