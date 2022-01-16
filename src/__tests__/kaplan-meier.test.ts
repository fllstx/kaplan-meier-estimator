import fs from 'fs';
import Papa from 'papaparse';
import * as KaplanMeier from 'kaplan-meier/js';
import { KaplanMeierData } from 'kaplan-meier/js';
import { find, groupBy, last, map, sortBy, uniq } from 'lodash';

import { compute, KaplanMeierEsimatorResult } from '../index';

const TESTS = [
	{
		/**
		 * Example from the german wikipedia:
		 * https://de.wikipedia.org/wiki/Kaplan-Meier-Sch%C3%A4tzer#Beispiel
		 */
		title: 'Wikipedia "Kaplan-Meier-Schätzer" sample',
		dummyFile: './src/__tests__/data/wikipedia-kaplan-meier-sample-plot.csv',
		accuracy: 100
	},
	{
		/**
		 * Example from "Understanding survival analysis: Kaplan-Meier estimate"
		 * by Goel, Khanna, and Kishore":
		 * https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3059453/table/T1/
		 */
		title: 'Goel, Khanna, and Kishore sample 1',
		dummyFile: './src/__tests__/data/goel-khanna-kishore-sample-data-1.csv',
		accuracy: 1_000
	},
	{
		/**
		 * Example from "Understanding survival analysis: Kaplan-Meier estimate"
		 * by Goel, Khanna, and Kishore":
		 * https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3059453/table/T2/
		 */
		title: 'Goel, Khanna, and Kishore sample 2',
		dummyFile: './src/__tests__/data/goel-khanna-kishore-sample-data-2.csv',
		accuracy: 1_000
	}
];

// This is needed for kaplan-meier's init function.
const lodashFunctions = {
	find,
	groupBy,
	last,
	pluck: map,
	sortBy,
	uniq
};

TESTS.forEach(test => {
	describe(test.title, () => {
		let dummyTimeToEvent: number[] = [];
		let dummyCensored: boolean[] = [];
		let dummyRate: number[] = [];

		beforeAll(() => {
			// load the sample data from a csv file
			const csvData = fs.readFileSync(test.dummyFile, 'utf8');
			const wikipediaDummyData = Papa.parse(csvData, {
				header: true,
				dynamicTyping: true
			}).data as {
				i: number;
				t: number;
				c: boolean;
				S: number;
			}[];

			dummyTimeToEvent = wikipediaDummyData.map(d => d.t);
			dummyCensored = wikipediaDummyData.map(d => d.c);
			dummyRate = wikipediaDummyData.map(d => d.S).filter(Boolean);
		});

		it(`compare to expected data`, () => {
			const result = compute(dummyTimeToEvent, dummyCensored);
			const resultRatesRounded = result.map(
				(r: KaplanMeierEsimatorResult) => Math.round(r.rate * test.accuracy) / test.accuracy
			);
			const dummyRateRounded = dummyRate.map(
				rate => Math.round(rate * test.accuracy) / test.accuracy
			);
			expect(resultRatesRounded.length).toEqual(dummyRateRounded.length);
			expect(resultRatesRounded).toEqual(dummyRateRounded);
		});

		it(`compare to "kaplan-meier" library's compute function`, () => {
			const kaplanData: KaplanMeierData[] = KaplanMeier.init(lodashFunctions).compute(
				dummyTimeToEvent,
				dummyCensored
			);
			const resultKaplanMeierLib: KaplanMeierEsimatorResult[] = kaplanData.map(
				(r: KaplanMeierData) => ({
					rate: r.s,
					time: r.t,
					censored: r.e
				})
			);
			const result = compute(dummyTimeToEvent, dummyCensored);
			expect(result).toEqual(resultKaplanMeierLib);
		});
	});
});
