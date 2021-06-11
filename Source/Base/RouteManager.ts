import BaseRoute from "./BaseRoute";

export default class RouteManager {
	public cache: Map<string, BaseRoute> = new Map();

	register(name: string, endpoint: BaseRoute) {
		this.cache.set(name.toLowerCase(), endpoint);
		return true;
	}

	get(name: string) {
		const endpoint = this.cache.get(name.toLowerCase());

		if(!endpoint) return null;
		return endpoint;
	}
};