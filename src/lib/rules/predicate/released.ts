import { PredicateBuilder } from '@core/lib/rules';
import { MovieDetails } from '@core/api/overseerr/interfaces';
import { BooleanPredicate, BooleanPredicateParameters, fromHumanReadableBoolean } from '@core/lib/rules/predicate/boolean';
import { ReleasedOptions } from '@core/lib/rules/interfaces';

export type ReleasedPredicateParameters = BooleanPredicateParameters;

export class ReleasedPredicate extends BooleanPredicate {
    constructor(options: ReleasedPredicateParameters) {
        super(options);
    }

    matches(movie: MovieDetails): boolean {
        if (movie.status) {
            const released = movie.status.toLowerCase() === 'released';
            return released == this.targetValue;
        } else if (movie.releaseDate) {
            const movieReleaseDate = new Date(movie.releaseDate);
            const released = movieReleaseDate.getTime() < Date.now();
            return released == this.targetValue;
        }
        return false;
    }
}

export const ReleasedPredicateBuilder: PredicateBuilder = {
    key: 'released',
    build: (data: ReleasedOptions) => {
        const parameters = {
            value: typeof data.released === 'boolean' ? data.released : fromHumanReadableBoolean(data.released),
        };
        return new ReleasedPredicate(parameters);
    },
};
