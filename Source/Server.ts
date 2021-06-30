import { App } from "./Base/App";
import { config } from "dotenv";
import { join } from "path";
config();

new App()
	.start({
		routesDir: join(__dirname, "Routes"),
	});