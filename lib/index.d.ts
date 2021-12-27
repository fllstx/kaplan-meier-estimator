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
/**
 * See http://en.wikipedia.org/wiki/Kaplan%E2%80%93Meier_estimator
 *
 * tte  time to exit (event or censor)
 *  ev   is truthy if there is an event.
 */
export declare function kaplanMeierEsimator(events: number[], censors: boolean[]): kaplanMeierEsimatorResult[];
