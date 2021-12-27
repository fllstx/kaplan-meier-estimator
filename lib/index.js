import { groupBy, sortBy } from 'lodash';
/**
 * Compute at-risk, exiting, and deaths for each time t[i], from a list of events.
 *
 * @param {number[]} tte time to exit (event or censor).
 * @param {boolean[]} ev is truthy if there is an event.
 * @returns {TimeTableData[]}
 */
function timeTable(tte, ev) {
    // sort and collate
    var exits = sortBy(tte.map(function (x, i) { return ({ tte: x, ev: ev[i] }); }), 'tte');
    // unique tte
    var uniqExits = Array.from(new Set(tte));
    // group by common time of exit
    var gexits = groupBy(exits, function (x) { return x.tte; });
    var firstEntry = { n: exits.length, e: 0 };
    // compute d_i, n_i for times t_i (including censor times)
    var result = uniqExits.reduce(function (a, tte) {
        var group = gexits[tte];
        var l = a.length ? a[a.length - 1] : firstEntry;
        var events = group.filter(function (x) { return x.ev; });
        var n = l.n - l.e;
        a.push({
            n: n,
            e: group.length,
            d: events.length,
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
export function kaplanMeierEsimator(events, censors) {
    if (events.length !== censors.length)
        throw new Error('[kaplan-meier-esimator]: events and censors must be of same length');
    var dini = timeTable(events, censors);
    var firstEntry = {
        s: 1,
        t: 0
    };
    // s : the survival rate from t=0 to the particular time (i.e. the
    //     end of the time interval)
    // rate : the chance of an event happened within the time interval (as in t
    //     and the previous t with an event)
    var result = dini.reduce(function (a, dn) {
        // survival at each t_i (including censor times)
        var l = a.length ? a[a.length - 1] : firstEntry;
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
        }
        else {
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
    }, []);
    return result.map(function (r) { return ({
        rate: r.s,
        time: r.t
    }); });
}
