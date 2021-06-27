export default class SuperMap<K, V> extends Map<K, V> {
	// eslint-disable-next-line no-unused-vars
	public map<T>(fn: (value: V, key: K, collection: this) => T, thisArg?: unknown): T[] {

		if (typeof thisArg !== "undefined") fn = fn.bind(thisArg);

		const iter = this.entries();

		return Array.from({ length: this.size }, (): T => {
			const [key, value] = iter.next().value;
			return fn(value, key, this);
		});
	}

	// eslint-disable-next-line no-unused-vars
	filter(fn: (value: V, key: K, collection: this) => boolean, thisArg?: unknown) {
		if(typeof thisArg !== "undefined") fn = fn.bind(thisArg);

		const newMap: SuperMap<K, V> = new SuperMap();

		for (const [key, val] of this) {
			if (fn(val, key, this)) newMap.set(key, val);
		}

		return newMap;
	}
}