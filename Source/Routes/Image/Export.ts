import RouteExport from "../../Constants/RouteExport";

const WideImage: RouteExport = {
	name: "wideimage",
	description: "WIDE IMAGE POG",
	async run(req, res) {
		res.send("<h1>Hello World</h1>");
	},
	params: [],
};

export default WideImage;