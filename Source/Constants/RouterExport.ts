import { Router } from "express";

interface RouterExport {
	name: string,
	router: Router,
	routesDir: string,
};

export default RouterExport;