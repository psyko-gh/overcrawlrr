import { MovieDetails } from '@core/api/overseerr/interfaces';
import { PredicateBuilder } from '@core/lib/rules';
import { fromHumanReadableDuration, TimePredicate, TimePredicateParameters } from '@core/lib/rules/predicate/time';
import { AgeOptions } from '@core/lib/rules/interfaces';

export type AgePredicateParameters = TimePredicateParameters;

export class AgePredicate extends TimePredicate {
    constructor(options: AgePredicateParameters) {
        super(options);
    }

    protected getMetrics(movie: MovieDetails): number {
        if (!movie.releaseDate) {
            return 0;
        }
        return (Date.now() - Date.parse(movie.releaseDate)) / 1000;
    }
}

export const AgePredicateBuilder: PredicateBuilder = {
    key: 'age',
    build: (data: AgeOptions) => new AgePredicate(fromHumanReadableDuration(data.age)),
};
