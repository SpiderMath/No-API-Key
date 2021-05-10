import { Router } from "express";
import KanyeQuotes from "../../Assets/JSON/KanyeQuotes.json";
import RouterExport from "../Constants/RouterExport";

const KanyeRouter = Router();

const configuration: RouterExport = {
	router: KanyeRouter,
	name: "kanye",
};

KanyeRouter.get("/", (req, res) => {
	res.status(200).send(KanyeQuotes[Math.floor(Math.random() * KanyeQuotes.length)]);
});

KanyeRouter.get("/:id", (req, res) => {
	const obj = KanyeQuotes[Number(req.params.id) - 1];

	if(obj !== undefined) return res.status(200).send(obj);

	res.status(400).send({ error: "There is no quote of that ID!" });
});

export default configuration;