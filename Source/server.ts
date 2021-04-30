import express from "express";
import Logger from "./Helpers/Logger";

const app = express();

const port = 6969;

app.listen(port, () => Logger.success("server", `Listening to API Calls on port ${port}!`));

app.get("/", (req, res) => {
	res.send("<b>Hello World!</b>");
});