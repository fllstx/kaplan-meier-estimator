import { groupBy, sortBy, uniq } from './helpers';

export interface KaplanMeierEsimatorData {
	tte: number;
	ev: boolean;
}

export interface KaplanMeierEsimatorResult {
	rate: number;
	time: number;
}

interface KaplanMeierResultData {
	d?: number;
	e?: boolean;
	n?: number;
	rate?: number | null;
	s: number;
	t: number;
}

interface TimeTableData {
	n: number;
	e: number;
	d?: number;
	t?: number;
}

/**
 * Compute at-risk, exiting, and deaths for each time t[i], from a list of events.
 *
 * @param {number[]} tte time to exit (event or censor).
 * @param {boolean[]} ev is truthy if there is an event.
 * @returns {TimeTableData[]}
 */
function timeTable(tte: number[], ev: boolean[]): TimeTableData[] {
	// sort and collate
	const exits: KaplanMeierEsimatorData[] = sortBy(
		tte.map((x, i) => ({ tte: x, ev: ev[i] })),
		'tte'
	);

	// unique tte
	const uniqTtes = uniq<number>(tte);

	// group by common time of exit
	const groupedTtes = groupBy<KaplanMeierEsimatorData, number>(
		exits,
		(x: KaplanMeierEsimatorData) => x.tte
	);

	const firstEntry = { n: exits.length, e: 0 };

	// compute d[i], n[i] for times t[i] (including censor times)
	const result = uniqTtes.reduce((a: TimeTableData[], tte: number) => {
		const group = groupedTtes[tte];
		const l: TimeTableData = a.length ? a[a.length - 1] : firstEntry;
		const events = group.filter((x: KaplanMeierEsimatorData) => x.ev);

		const n = l.n - l.e;

		a.push({
			n, // at risk
			e: group.length, // number exiting
			d: events.length, // number events (death)
			t: group[0].tte // time
		});
		return a;
	}, []);

	return result;
}

export function init(lodashFunctions: {
	pluck?: unknown;
	uniq?: unknown;
	sortBy?: unknown;
	groupBy?: unknown;
	last?: unknown;
	find?: unknown;
}) {
	if (!lodashFunctions)
		return {
			compute
		};
}

/**
 * @see http://en.wikipedia.org/wiki/Kaplan%E2%80%93Meier_estimator
 *
 * @export
 * @param {number[]} events time to exit (event or censor).
 * @param {boolean[]} censors is truthy if there is an event.
 * @returns {KaplanMeierEsimatorResult[]}
 */
export function compute(events: number[], censors: boolean[]): KaplanMeierEsimatorResult[] {
	if (events.length !== censors.length) {
		throw new Error('[kaplan-meier-esimator]: events and censors must be of same length');
	}

	const dini: TimeTableData[] = timeTable(events, censors);

	const firstEntry: KaplanMeierResultData = {
		s: 1,
		t: 0
	};

	// s : the survival rate from t=0 to the particular time (i.e. the end of the time interval)
	// rate : the chance of an event happened within the time interval (as in t and the previous t with an event)
	const result: KaplanMeierResultData[] = dini.reduce(
		(a: KaplanMeierResultData[], dn: TimeTableData) => {
			// survival at each t[i] (including censor times)
			const l: KaplanMeierResultData = a.length ? a[a.length - 1] : firstEntry;

			if (dn.d) {
				// there were events at this t_i
				a.push({
					t: dn.t || 0,
					e: true,
					s: l.s * (1 - dn.d / dn.n),
					n: dn.n,
					d: dn.d,
					rate: dn.d / dn.n
				});
			} else {
				// only censors
				a.push({
					t: dn.t || 0,
					e: false,
					s: l.s,
					n: dn.n,
					d: dn.d,
					rate: null
				});
			}
			return a;
		},
		[]
	);

	return result.map(r => ({
		rate: r.s,
		time: r.t
	}));
}
