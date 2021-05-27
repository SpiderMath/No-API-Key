import RouteExport from "../../Constants/RouteExport";
import { loadImage, createCanvas } from "canvas";

const AttachmentTestRoute: RouteExport = {
	name: "attachment",
	description: "Gives you your Attached Image Back 💃",
	admin: false,
	parameters: [
		{
			name: "url",
			description: "URL of the Image",
			required: true,
			type: "string",
		},
	],
	async run(req, res, app) {
		const query = req.query.url;

		// @ts-ignore
		const image = await loadImage(query);
		const canvas = createCanvas(image.width, image.height);

		canvas.getContext("2d").drawImage(image, 0, 0);

		app.successResImage(res, canvas.toBuffer());
	},
};

export default AttachmentTestRoute;