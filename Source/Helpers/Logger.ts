import { existsSync, readFileSync, writeFileSync } from "fs";
import { mkdir } from "fs/promises";
import { join } from "path";

export interface Log {
	type: "success" | "warn" | "info" | "error",
	id: number,
	context: string,
	message: string,
	timestamp: string,
	stack?: string,
}

export default class Logger {
	public logLocation: string = join(__dirname, "../../Logs/Logs.json");
	private ansiCodes = {
		red : "\x1b[31m",
		green : "\x1b[32m",
		yellow : "\x1b[33m",
		blue : "\x1b[34m",
		reset : "\u001b[0m",
	}

	async start() {
		if(!existsSync(join(__dirname, "../../Logs"))) await mkdir(join(__dirname, "../../Logs"));
		if(!existsSync(join(__dirname, "../../Logs", "Logs.json"))) await writeFileSync(join(__dirname, "../../Logs/Logs.json"), JSON.stringify([]));

		return this;
	}

	updateFile(logType: "success" | "warn" | "info" | "error", context: string, message: string, timestamp: string, stack?: string) {
		const freshLogs = this.readJSON();

		freshLogs
			.push({
				id: freshLogs.length + 1,
				type: logType,
				context,
				message,
				timestamp,
				stack,
			});

		writeFileSync(this.logLocation, JSON.stringify(freshLogs, null, "\t"));
	}

	readJSON() {
		const response = readFileSync(this.logLocation);

		const freshLogs = JSON.parse(response.toString());

		return freshLogs as Log[];
	}

	getTimestamp() {
		return new Date().toUTCString();
	}

	success(context: string, message: string) {
		const timestamp = this.getTimestamp();
		console.log(`${this.ansiCodes.green}${timestamp} ${context}: ${this.ansiCodes.reset}${message}`);

		this.updateFile("success", context, message, timestamp);
	}

	info(context: string, message: string) {
		const timestamp = this.getTimestamp();
		console.log(`${this.ansiCodes.blue}${timestamp} ${context}: ${this.ansiCodes.reset}${message}`);

		this.updateFile("info", context, message, timestamp);
	}

	error(context: string, message: string, stack?: string) {
		const timestamp = this.getTimestamp();
		console.log(`${this.ansiCodes.red}${timestamp} ${context}: ${this.ansiCodes.reset}${message}`);

		this.updateFile("error", context, message, timestamp, stack);
	}

	warn(context: string, message: string) {
		const timestamp = this.getTimestamp();
		console.log(`${this.ansiCodes.yellow}${timestamp} ${context}: ${this.ansiCodes.reset}${message}`);

		this.updateFile("warn", context, message, timestamp);
	}
};