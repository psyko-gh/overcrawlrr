import { Predicate } from '@core/lib/rules';
import { MovieDetails } from '@core/api/overseerr/interfaces';

export type NumberPredicateParameters = {
    threshold: number;
    operator: 'lt' | 'gt';
};

export abstract class NumberPredicate extends Predicate {
    private threshold: number;
    private operator: 'lt' | 'gt';

    constructor(options: NumberPredicateParameters) {
        super();
        this.threshold = options.threshold;
        this.operator = options.operator;
    }

    protected abstract getMetrics(movie: MovieDetails): number;

    matches(movie: MovieDetails): boolean {
        const metric = this.getMetrics(movie);
        if (this.operator === 'lt') {
            return metric < this.threshold;
        }
        return metric > this.threshold;
    }
}

export const fromHumanReadableNumber = (str: string): { threshold: number; operator: 'lt' | 'gt' } => {
    const regex = /(below|under|less than|above|greater than) (\d+(\.\d+)?)/gm;
    const groups = [...str.matchAll(regex)][0];
    if (!groups) {
        throw new Error(`Unparsable number string '${str}' !`);
    }
    const operator = groups[1];
    const threshold = Number(groups[2]);
    return {
        operator: ['below', 'under', 'less than'].includes(operator) ? 'lt' : 'gt',
        threshold: threshold,
    };
};
