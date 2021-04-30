import { Router } from "express";
import RouterExport from "../Constants/RouterExport";

const ImageRouter = Router();

ImageRouter.get("/", (req, res) => res.send("e"));

const configuration: RouterExport = {
	router: ImageRouter,
	name: "image",
};

export default configuration;