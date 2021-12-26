import { groupBy, sortBy } from 'lodash';

export interface kaplanMeierEsimatorResult {
	rate: number;
	time: number;
}

export interface KaplanMeierResultData {
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
	const exits = sortBy(
		tte.map((x, i) => ({ tte: x, ev: ev[i] })),
		'tte'
	);

	// unique tte
	const uniqExits = Array.from(new Set(tte));

	// group by common time of exit
	const gexits = groupBy(exits, x => x.tte);

	const firstEntry = { n: exits.length, e: 0 };

	// compute d_i, n_i for times t_i (including censor times)
	const result = uniqExits.reduce(function (a: TimeTableData[], tte) {
		const group = gexits[tte];
		const l: TimeTableData = a.length ? a[a.length - 1] : firstEntry;
		const events = group.filter(x => x.ev);

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

/**
 * See http://en.wikipedia.org/wiki/Kaplan%E2%80%93Meier_estimator
 *
 * tte  time to exit (event or censor)
 *  ev   is truthy if there is an event.
 */
export function kaplanMeierEsimator(
	events: number[],
	censors: boolean[]
): kaplanMeierEsimatorResult[] {
	if (events.length !== censors.length)
		throw new Error('[kaplan-meier-esimator]: events and censors must be of same length');

	const dini: TimeTableData[] = timeTable(events, censors);

	const firstEntry: KaplanMeierResultData = {
		s: 1,
		t: 0
	};

	// s : the survival rate from t=0 to the particular time (i.e. the
	//     end of the time interval)
	// rate : the chance of an event happened within the time interval (as in t
	//     and the previous t with an event)
	const result: KaplanMeierResultData[] = dini.reduce(
		(a: KaplanMeierResultData[], dn: TimeTableData) => {
			// survival at each t_i (including censor times)
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
