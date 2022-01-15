declare module 'kaplan-meier/js' {
	export interface KaplanMeierData {
		d: number;
		e: boolean;
		n: number;
		rate: number | null;
		s: number;
		t: number;
	}

	export interface KaplanMeierGroupedData {
		tte: number;
		ev: boolean;
	}

	export interface KaplanMeierLogRankTestResult {
		dof: number; //degree of freedom
		KMStats: number[];
		pValue: number;
	}

	export interface KaplanMeierExpectedObservedEventNumberResult {
		expected: number[],
		observed: number[],
		dataByTimeTable: number[],
		timeNumber: number
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

	export function init(initObj: InitObj): KaplanMeierObject;

	export function compute(tte: number[], ev: boolean[]): KaplanMeierData[];

	export function expectedObservedEventNumber(
		groupedDataTable: KaplanMeierGroupedData[]
	): KaplanMeierExpectedObservedEventNumberResult;

	export function logranktest(
		groupedDataTable: KaplanMeierGroupedData[]
	): KaplanMeierLogRankTestResult;
	
	export interface KaplanMeierObject {
		init: (initObj: InitObj) => KaplanMeierObject;
		compute: (tte: number[], ev: boolean[]) => KaplanMeierData[];
		expectedObservedEventNumber: (
			groupedDataTable: KaplanMeierGroupedData[]
		) => KaplanMeierExpectedObservedEventNumberResult;
		logranktest:(
			groupedDataTable: KaplanMeierGroupedData[]
		) => any;
	}
}
