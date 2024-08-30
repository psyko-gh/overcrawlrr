import { MovieDetails } from '@core/api/overseerr/interfaces';
import { PredicateBuilder } from '@core/lib/rules';
import { fromHumanReadableDuration, TimePredicate, TimePredicateParameters } from '@core/lib/rules/predicate/time';
import { RuntimeOptions } from '@core/lib/rules/interfaces';

export type RuntimePredicateParameters = TimePredicateParameters;

export class RuntimePredicate extends TimePredicate {
    constructor(options: RuntimePredicateParameters) {
        super(options);
    }

    protected getMetrics(movie: MovieDetails): number {
        if (!movie.runtime) {
            return 0;
        }
        return Number(movie.runtime) * 60;
    }
}

export const RuntimePredicateBuilder: PredicateBuilder = {
    key: 'runtime',
    build: (data: RuntimeOptions) => new RuntimePredicate(fromHumanReadableDuration(data.runtime)),
};
