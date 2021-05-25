import RouteExport from "../../Constants/RouteExport";

const TestRoute: RouteExport = {
	name: "test",
	description: "This is a test route",
	parameters: [{
		name: "param",
		description: "parameter for test",
		required: true,
		type: "boolean",
	}],
	admin: true,
	async run(req, res, app) {
		console.log(app.routes.random());

		res.send("Working!");
	},
	type: "get",
};

export default TestRoute;