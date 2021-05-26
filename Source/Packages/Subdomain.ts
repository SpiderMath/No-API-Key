import { Application, Router } from "express";

export default function Subdomain(subdomainName: string, router: Router, app: Application) {
	app.use((req, res, next) => {
		if(req.subdomains.length && (req.subdomains[0].toLowerCase() === subdomainName.toLowerCase())) {
			next();
		}
	});
	app.use("/", router);
}