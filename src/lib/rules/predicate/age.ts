import { MovieDetails } from '@core/api/overseerr/interfaces';
import { PredicateBuilder } from '@core/lib/rules';
import { fromHumanReadableDuration, TimePredicate } from '@core/lib/rules/predicate/time';
import { AgeOptions } from '@core/lib/rules/interfaces';

export class AgePredicate extends TimePredicate {
    constructor(options: AgeOptions) {
        super(fromHumanReadableDuration(options.age), ageMetric);
    }
}

const ageMetric = (movie: MovieDetails): number => {
    if (!movie.releaseDate) {
        return 0;
    }
    return (Date.now() - Date.parse(movie.releaseDate)) / 1000;
};

export const AgePredicateBuilder: PredicateBuilder = {
    key: 'age',
    build: (data: AgeOptions) => new AgePredicate(data),
};
