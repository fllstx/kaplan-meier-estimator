var KME = (function (exports) {
    'use strict';

    /**
     * Sort a collection by a given key.
     *
     * @export
     * @template T
     * @param {T[]} collection
     * @param {keyof T} key
     * @returns {T[]} sorted collection
     */
    function sortBy(collection, key) {
        return collection.sort((a, b) => a[key] - b[key]);
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
    function groupBy(collection, getKey) {
        return collection.reduce((previous, currentItem) => {
            const group = getKey(currentItem);
            if (!previous[group])
                previous[group] = [];
            previous[group].push(currentItem);
            return previous;
        }, {});
    }
    /**
     * Return a list of unique values.
     *
     * @export
     * @template T
     * @param {T[]} list
     * @returns {T[]}
     */
    function uniq(list) {
        return Array.from(new Set(list));
    }

    /**
     * Compute at-risk, exiting, and deaths for each time t[i], from a list of events.
     *
     * @param {number[]} tte time to exit (event or censor).
     * @param {boolean[]} ev is truthy if there is an event.
     * @returns {TimeTableData[]}
     */
    function timeTable(tte, ev) {
        // sort and collate
        const exits = sortBy(tte.map((x, i) => ({ tte: x, ev: ev[i] })), 'tte');
        // unique tte
        const uniqTtes = uniq(tte);
        // group by common time of exit
        const groupedTtes = groupBy(exits, (x) => x.tte);
        const firstEntry = { n: exits.length, e: 0 };
        // compute d_i, n_i for times t_i (including censor times)
        const result = uniqTtes.reduce((a, tte) => {
            const group = groupedTtes[tte];
            const l = a.length ? a[a.length - 1] : firstEntry;
            const events = group.filter((x) => x.ev);
            const n = l.n - l.e;
            a.push({
                n,
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
    function kaplanMeierEsimator(events, censors) {
        if (events.length !== censors.length)
            throw new Error('[kaplan-meier-esimator]: events and censors must be of same length');
        const dini = timeTable(events, censors);
        const firstEntry = {
            s: 1,
            t: 0
        };
        // s : the survival rate from t=0 to the particular time (i.e. the
        //     end of the time interval)
        // rate : the chance of an event happened within the time interval (as in t
        //     and the previous t with an event)
        const result = dini.reduce((a, dn) => {
            // survival at each t_i (including censor times)
            const l = a.length ? a[a.length - 1] : firstEntry;
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
        return result.map(r => ({
            rate: r.s,
            time: r.t
        }));
    }

    exports.kaplanMeierEsimator = kaplanMeierEsimator;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({});
//# sourceMappingURL=kaplan-meier-estimator.iife.js.map
