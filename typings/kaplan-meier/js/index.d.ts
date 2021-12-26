/**
 * @author Alexander Wunschik <alexander.wunschik@fullstax.de>
 * @author Nico Koenig <nico.koenig@fullstax.de>
 * @author Joanna Surzyn <joanna.surzyn@fullstax.de>
 * @copyright © Siemens Healthcare GmbH, 2019-2021 All Rights Reserved
 */

// TODO: #686 - package typings
declare module 'kaplan-meier/js' {
	export interface KaplanMeierData {
		d: number;
		e: boolean;
		n: number;
		rate: number | null;
		s: number;
		t: number;
	}

	/**
	 * A helper library such as underscore/lodash/ramda with
	 * the following methods is required, and must be passed
	 * to the init function.
	 * Note since v4.0.0, lodash no longer has a pluck method
	 */
	export interface InitObj {
		find: unknown;
		groupBy: unknown;
		last: unknown;
		pluck: unknown;
		sortBy: unknown;
		uniq: unknown;
	}

	export interface KaplanMeierObject {
		init: (initObj: InitObj) => KaplanMeierObject;
		compute: (tte: number[], ev: boolean[]) => KaplanMeierData[];
	}

	export function init(initObj: InitObj): KaplanMeierObject;
	export function compute(tte: number[], ev: boolean[]): KaplanMeierData[];
}
