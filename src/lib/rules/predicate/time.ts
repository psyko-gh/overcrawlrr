import { NumberPredicate, NumberPredicateOptions } from '@core/lib/rules/predicate/number';
import { MovieDetails } from '@core/api/overseerr/interfaces';

export type TimePredicateOptions = NumberPredicateOptions;

export interface TimeMetricsExtractor {
    (movie: MovieDetails): number;
}

export class TimePredicate extends NumberPredicate {
    protected constructor(options: TimePredicateOptions, metrics: TimeMetricsExtractor) {
        super(options, metrics);
    }
}

export const fromHumanReadableDuration = (str: string): { threshold: number; operator: 'lt' | 'gt' } => {
    const regex = /(less than|more than) (\d+(\.\d+)?) (years|year|days|day|month|months|weeks|week)/gm;
    const groups = [...str.matchAll(regex)][0];
    const operator = groups[1];
    const threshold: number = Number(groups[2]);
    const units = groups[4].endsWith('s') ? groups[4] : `${groups[4]}s`;
    const scale: Record<string, number> = {
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
