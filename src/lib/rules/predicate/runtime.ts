import { MovieDetails } from '@core/api/overseerr/interfaces';
import { PredicateBuilder } from '@core/lib/rules';
import { fromHumanReadableDuration, TimePredicate } from '@core/lib/rules/predicate/time';
import { RuntimeOptions } from '@core/lib/rules/interfaces';

export class RuntimePredicate extends TimePredicate {
    constructor(options: RuntimeOptions) {
        super(fromHumanReadableDuration(options.runtime), runtimeMetric);
    }
}

const runtimeMetric = (movie: MovieDetails): number => {
    if (!movie.runtime) {
        return 0;
    }
    return Number(movie.runtime) * 60;
};

export const RuntimePredicateBuilder: PredicateBuilder = {
    key: 'runtime',
    build: (data: RuntimeOptions) => new RuntimePredicate(data),
};
