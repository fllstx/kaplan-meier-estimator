import * as KaplanMeier from 'kaplan-meier/js';
import { KaplanMeierData } from 'kaplan-meier/js';
import { find, groupBy, last, map, sortBy, uniq } from 'lodash';

import { kaplanMeierEsimator, kaplanMeierEsimatorResult } from '../index';

/**
 * This function calculates the Kaplan-Meier estimate
 * using the external library "kaplan-meier".
 *
 * @see https://github.com/ucscXena/kaplan-meier
 *
 * @param {number[]} events
 * @param {boolean[]} censores
 * @returns
 */
function getKaplanMeierEsimatorFromKaplanMeierLib(
	events: number[],
	censores: boolean[]
): kaplanMeierEsimatorResult[] {
	const kaplanData: KaplanMeierData[] = KaplanMeier.init({
		find,
		groupBy,
		last,
		pluck: map,
		sortBy,
		uniq
	}).compute(events, censores);

	return kaplanData.map((r: KaplanMeierData) => ({
		rate: r.s,
		time: r.t
	}));
}

describe('', () => {
	test('wikipedia example data', () => {
		// example from wikipedia: https://commons.wikimedia.org/wiki/File:Kaplan-Meier-sample-plot.svg
		const events = [1, 12, 22, 29, 31, 36, 38, 50, 60, 61, 70, 88, 99, 110, 140];
		const censores = [
			false,
			true,
			false,
			true,
			true,
			false,
			false,
			false,
			false,
			true,
			true,
			false,
			false,
			false,
			false
		];

		const resultKaplanMeierLib = getKaplanMeierEsimatorFromKaplanMeierLib(events, censores);
		const result = kaplanMeierEsimator(events, censores);
		expect(result).toEqual(resultKaplanMeierLib);
	});

	test('Understanding survival analysis', () => {
		// example from "Understanding survival analysis: Kaplan-Meier estimate"
		// by Goel, Khanna, and Kishore":  https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3059453/
		const events = [
			6, 12, 21, 27, 32, 39, 43, 43, 46, 89, 115, 139, 181, 211, 217, 261, 263, 270, 295, 311, 335,
			346, 365
		];
		const censores = [
			true,
			true,
			true,
			true,
			true,
			true,
			true,
			true,
			false,
			true,
			false,
			false,
			false,
			false,
			false,
			true,
			true,
			true,
			false,
			true,
			false,
			false,
			false
		];

		const resultKaplanMeierLib = getKaplanMeierEsimatorFromKaplanMeierLib(events, censores);
		const result = kaplanMeierEsimator(events, censores);

		expect(result).toEqual(resultKaplanMeierLib);
	});
});
