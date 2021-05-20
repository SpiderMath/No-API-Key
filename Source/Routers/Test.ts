import { Router } from "express";
import RouterExport from "../Constants/Router";

const TestRouter = Router();

/**
 * @swagger
 * /test:
 *   get:
 *     description: Test
 *     tags: [Test]
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Error
 */
TestRouter
	.get("/", (req, res) => res.send("This is a Test?!"));

const configuration: RouterExport = {
	name: "test",
	router: TestRouter,
};

export default configuration;