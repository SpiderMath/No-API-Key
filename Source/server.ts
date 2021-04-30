import express from "express";

const app = express();

const port = 6969;

app.listen(port, () => console.log(`Listening to API Calls on port ${port}!`));

app.get("/", (req, res) => {
	res.send("<b>Hello World!</b>");
});