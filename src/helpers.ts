/**
 * Sort a collection by a given key.
 *
 * @export
 * @template T
 * @param {T[]} collection
 * @param {keyof T} key
 * @returns {T[]} sorted collection
 */
export function sortBy<T>(collection: T[], key: keyof T): T[] {
	return collection.sort((a, b) => (a[key] as never) - (b[key] as never));
}

/**
 * Splits a collection into sets, grouped by the result of running each value through iteratee.
 * If iteratee is a string instead of a function, groups by the property named by iteratee on each of the values.
 *
 * @copyright CC BY-SA 4.0 by kevinrodriguez-io
 * @see https://stackoverflow.com/a/62765924/722162
 *
 * @export
 * @template T
 * @template K
 * @param {T[]} collection
 * @param {(item: T) => K} getKey function that returns the key to group by
 * @returns {{ [K: number]: T[] }}
 */
export function groupBy<T, K extends number>(
	collection: T[],
	getKey: (item: T) => K
): { [K: number]: T[] } {
	return collection.reduce((previous, currentItem) => {
		const group = getKey(currentItem);
		if (!previous[group]) previous[group] = [];
		previous[group].push(currentItem);
		return previous;
	}, {} as { [K: number]: T[] });
}

/**
 * Return a list of unique values.
 *
 * @export
 * @template T
 * @param {T[]} list
 * @returns {T[]}
 */
export function uniq<T>(list: T[]): T[] {
	return Array.from(new Set(list));
}
