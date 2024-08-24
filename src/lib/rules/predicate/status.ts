import { MovieDetails } from '@core/api/overseerr/interfaces';
import { PredicateBuilder } from '@core/lib/rules';
import TagsPredicate from '@core/lib/rules/predicate/tag';
import { StatusOptions } from '@core/lib/rules/interfaces';

export class StatusPredicate extends TagsPredicate {
    constructor(options: StatusOptions) {
        super({
            terms: Array.isArray(options.status) ? options.status : [options.status],
        });
    }

    getTags(movie: MovieDetails): string[] {
        if (!movie.status) {
            return [];
        }

        return [movie.status];
    }
}

export const StatusPredicateBuilder: PredicateBuilder = {
    key: 'status',
    build: (data: StatusOptions) => new StatusPredicate(data),
};
