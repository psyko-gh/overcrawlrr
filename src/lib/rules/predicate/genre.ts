import { MovieDetails } from '@core/api/overseerr/interfaces';
import { PredicateBuilder } from '@core/lib/rules';
import { TagsPredicate, TagsPredicateParameters } from '@core/lib/rules/predicate/tag';
import { GenreOptions } from '@core/lib/rules/interfaces';

export type GenrePredicateParameters = TagsPredicateParameters;

export class GenrePredicate extends TagsPredicate {
    constructor(options: GenrePredicateParameters) {
        super(options);
    }

    getTags(movie: MovieDetails): string[] {
        if (!movie.genres) {
            return [];
        }

        return movie.genres.map((g) => g.name.toLowerCase());
    }
}

export const GenrePredicateBuilder: PredicateBuilder = {
    key: 'genre',
    build: (data: GenreOptions) => {
        const parameters = {
            terms: Array.isArray(data.genre) ? data.genre : [data.genre],
        };
        return new GenrePredicate(parameters);
    },
};
