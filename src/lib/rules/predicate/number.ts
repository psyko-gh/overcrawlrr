import {Predicate} from "@core/lib/rules";
import {MovieDetails} from "@core/api/overseerr/interfaces";

export type NumberPredicateOptions = {
    threshold: number;
    operator: 'lt' | 'gt';
}

export interface MetricsExtractor {
    (movie: MovieDetails): number;
}

export class NumberPredicate extends Predicate {
    private threshold: number;
    private operator: 'lt' | 'gt';
    private metrics: MetricsExtractor;

    constructor(options: NumberPredicateOptions, metrics: MetricsExtractor) {
        super();
        this.threshold = options.threshold;
        this.operator = options.operator;
        this.metrics = metrics;
    }

    private getMetrics(movie: MovieDetails): number {
        return this.metrics(movie);
    }

    matches(movie: MovieDetails): boolean {
        const measuredSeconds = this.getMetrics(movie);
        if (this.operator === 'lt') {
            return measuredSeconds < this.threshold;
        }
        return measuredSeconds > this.threshold;
    }
}

export const fromHumanReadableNumber = (str: string): {threshold: number, operator: 'lt' | 'gt' } => {
    const regex = /(below|under|less than|above|greater than) (\d+(\.\d+)?)/gm;
    const groups = [...str.matchAll(regex)][0]
    if (!groups) {
        throw new Error(`Unparsable number string '${str}' !`);
    }
    const operator = groups[1];
    const threshold = Number(groups[2]);
    return {
        operator: ['below', 'under', 'less than'].includes(operator) ? 'lt' : 'gt',
        threshold: threshold
    }
}