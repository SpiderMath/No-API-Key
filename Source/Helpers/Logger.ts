import { green, red, yellow, blue } from "chalk";
import { stripIndents } from "common-tags";

interface Log {
	type: "success" | "error" | "warn" | "info",
	timestamp: string,
	context: string,
	message: string,
	stack?: string,
}

export default class Logger {
	public cache: Log[] = [];
	private _getTimeStamp() {
		return new Date().toUTCString();
	}

	public success(context: string, message: string) {
		const timestamp = this._getTimeStamp();

		this.cache.push({
			type: "success",
			timestamp,
			context,
			message,
		});

		console.log(`${green(timestamp + ` ${context}`)} ${message}`);
	}

	public warn(context: string, message: string) {
		const timestamp = this._getTimeStamp();

		this.cache.push({
			type: "warn",
			timestamp,
			context,
			message,
		});

		console.log(`${yellow(timestamp + ` ${context}`)} ${message}`);
	}

	public info(context: string, message: string) {
		const timestamp = this._getTimeStamp();

		this.cache.push({
			type: "info",
			timestamp,
			context,
			message,
		});

		console.log(`${blue(timestamp + ` ${context}`)} ${message}`);
	}

	public error(context: string, message: string, stack: string = "") {
		const timestamp = this._getTimeStamp();

		this.cache.push({
			type: "error",
			timestamp,
			context,
			message,
			stack,
		});

		console.log(
			stripIndents`
				${red(timestamp + ` ${context}`)} ${message} ${stack.length > 0 ? `\n ${red("Stack:")} ${stack}` : ""}
			`);
	}
};