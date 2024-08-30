import { MovieDetails } from '@core/api/overseerr/interfaces';
import { PredicateBuilder } from '@core/lib/rules';
import { TagsPredicate, TagsPredicateParameters } from '@core/lib/rules/predicate/tag';
import { StatusOptions } from '@core/lib/rules/interfaces';

export type StatusPredicateParameters = TagsPredicateParameters;

export class StatusPredicate extends TagsPredicate {
    constructor(options: StatusPredicateParameters) {
        super(options);
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
    build: (data: StatusOptions) => {
        const parameters = {
            terms: Array.isArray(data.status) ? data.status : [data.status],
        };
        return new StatusPredicate(parameters);
    },
};
