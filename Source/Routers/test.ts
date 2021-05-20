import { Router } from "express";
import RouterExport from "../Constants/RouterExport";

const testRouter = Router();

const configuration: RouterExport = {
	name: "test",
	router: testRouter,
	routesDir: "test",
};

export default configuration;