import { groupBy, sortBy, uniq } from './helpers';

export interface KaplanMeierEstimatorResult {
	rate: number;
	time: number;
	event: boolean;
}

interface KaplanMeierEstimatorData {
	tte: number;
	ev: boolean;
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
	const exits: KaplanMeierEstimatorData[] = sortBy(
		tte.map((x, i) => ({ tte: x, ev: ev[i] })),
		'tte'
	);

	// unique tte
	const uniqTtes = uniq<number>(tte);

	// group by common time of exit
	const groupedTtes = groupBy<KaplanMeierEstimatorData, number>(
		exits,
		(x: KaplanMeierEstimatorData) => x.tte
	);

	const firstEntry = { n: exits.length, e: 0 };

	// compute d[i], n[i] for times t[i] (including censor times)
	const result = uniqTtes.reduce((a: TimeTableData[], tte: number) => {
		const group = groupedTtes[tte];
		const l: TimeTableData = a.length ? a[a.length - 1] : firstEntry;
		const events = group.filter((x: KaplanMeierEstimatorData) => x.ev);

		const n = l.n - l.e;

		a.push({
			n, // at risk
			e: group.length, // number exiting
			d: events.length, // number events (death)
			t: group[0].tte, // time
		});
		return a;
	}, []);

	return result;
}

/**
 * @see http://en.wikipedia.org/wiki/Kaplan%E2%80%93Meier_estimator
 *
 * @export
 * @param {number[]} ttes time to exit (event or censor).
 * @param {boolean[]} events is truthy if there is an event.
 * @returns {KaplanMeierEstimatorResult[]}
 */
export function compute(ttes: number[], events: boolean[]): KaplanMeierEstimatorResult[] {
	if (ttes.length !== events.length) {
		throw new Error('[kaplan-meier-estimator]: events and censors must be of same length');
	}

	const dini: TimeTableData[] = timeTable(ttes, events);

	const firstEntry: KaplanMeierResultData = {
		s: 1,
		t: 0,
	};

	// s : the survival rate from t=0 to the particular time (i.e. the end of the time interval)
	// rate : the chance of an event happened within the time interval (as in t and the previous t with an event)
	const result: KaplanMeierResultData[] = dini.reduce(
		(a: KaplanMeierResultData[], dn: TimeTableData) => {
			// survival at each t[i] (including censor times)
			const l: KaplanMeierResultData = a.length ? a[a.length - 1] : firstEntry;

			if (dn.d) {
				// there were events at this t[i]
				a.push({
					t: dn.t || 0,
					e: true,
					s: l.s * (1 - dn.d / dn.n),
					n: dn.n,
					d: dn.d,
					rate: dn.d / dn.n,
				});
			} else {
				// only censors
				a.push({
					t: dn.t || 0,
					e: false,
					s: l.s,
					n: dn.n,
					d: dn.d,
					rate: null,
				});
			}
			return a;
		},
		[]
	);

	return result.map(r => ({
		rate: r.s,
		time: r.t,
		event: r.e || false,
	}));
}
