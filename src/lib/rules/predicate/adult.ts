import { PredicateBuilder } from '@core/lib/rules';
import { MovieDetails } from '@core/api/overseerr/interfaces';
import { BooleanPredicate, BooleanPredicateParameters, fromHumanReadableBoolean } from '@core/lib/rules/predicate/boolean';
import { AdultOptions } from '@core/lib/rules/interfaces';

export type AdultPredicateParameters = BooleanPredicateParameters;

export class AdultPredicate extends BooleanPredicate {
    constructor(options: AdultPredicateParameters) {
        super(options);
    }

    matches(movie: MovieDetails): boolean {
        return movie.adult == this.targetValue;
    }
}

export const AdultPredicateBuilder: PredicateBuilder = {
    key: 'adult',
    build: (data: AdultOptions) => {
        const parameters = {
            value: typeof data.adult === 'boolean' ? data.adult : fromHumanReadableBoolean(data.adult),
        };
        return new AdultPredicate(parameters);
    },
};
