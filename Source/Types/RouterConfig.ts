interface EndpointConfig {
	name: string,
	description: string,
	adminOnly?: boolean,
	parameters?: Parameter[],
};

interface Parameter {
	name: string,
	description: string,
	type: "boolean" | "string" | "number",
	required: boolean,
}

export { EndpointConfig, Parameter };