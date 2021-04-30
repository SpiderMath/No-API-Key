import { Router } from "express";
import RouterExport from "../Constants/RouterExport";
import LoadRoutes from "../Helpers/LoadRoutes";

const ImageRouter = Router();

ImageRouter.get("/", (req, res) => res.send("e"));

const configuration: RouterExport = {
	router: ImageRouter,
	name: "image",
};

LoadRoutes("Image", configuration.router, configuration.name);

export default configuration;