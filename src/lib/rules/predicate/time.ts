import { NumberPredicate, NumberPredicateParameters } from '@core/lib/rules/predicate/number';

export type TimePredicateParameters = NumberPredicateParameters;

export abstract class TimePredicate extends NumberPredicate {
    protected constructor(options: TimePredicateParameters) {
        super(options);
    }
}

export const fromHumanReadableDuration = (str: string): NumberPredicateParameters => {
    const regex = /(less than|more than) (\d+(\.\d+)?) (year|month|week|day|hour|minute)[s]?/gm;
    const groups = [...str.matchAll(regex)][0];
    const operator = groups[1];
    const threshold: number = Number(groups[2]);
    const units = groups[4].endsWith('s') ? groups[4] : `${groups[4]}s`;
    const scale: Record<string, number> = {
        minutes: 60,
        hours: 60 * 60,
        days: 24 * 60 * 60,
        weeks: 7 * 24 * 60 * 60,
        months: 30 * 24 * 60 * 60,
        years: 365 * 24 * 60 * 60,
    };
    return {
        operator: operator === 'less than' ? 'lt' : 'gt',
        threshold: threshold * scale[units],
    };
};
