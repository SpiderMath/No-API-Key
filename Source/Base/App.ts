import express from "express";

export class App {
	public main = express();

	async start() {
		const PORT = process.env.PORT || 1010;

		this.main.listen(PORT, () => console.log(`Listening for API calls on port ${PORT}`));
	}
};