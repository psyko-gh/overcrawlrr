import { PredicateBuilder } from '@core/lib/rules';
import { MovieDetails } from '@core/api/overseerr/interfaces';
import { BooleanPredicate } from '@core/lib/rules/predicate/boolean';
import { AdultOptions, ReleasedOptions } from '@core/lib/rules/interfaces';

export class AdultPredicate extends BooleanPredicate {
    constructor(options: AdultOptions) {
        super({
            value: options.adult,
        });
    }

    matches(movie: MovieDetails): boolean {
        return movie.adult == this.targetValue;
    }
}

export const AdultPredicateBuilder: PredicateBuilder = {
    key: 'adult',
    build: (data: AdultOptions) => new AdultPredicate(data),
};
