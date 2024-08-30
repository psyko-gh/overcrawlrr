import { MovieDetails } from '@core/api/overseerr/interfaces';
import { PredicateBuilder } from '@core/lib/rules';
import { TagsPredicate, TagsPredicateParameters } from '@core/lib/rules/predicate/tag';
import { OriginalLanguageOptions } from '@core/lib/rules/interfaces';

export type OriginalLanguagePredicateParameters = TagsPredicateParameters;

export class OriginalLanguagePredicate extends TagsPredicate {
    constructor(options: OriginalLanguagePredicateParameters) {
        super(options);
    }

    getTags(movie: MovieDetails): string[] {
        if (!movie.originalLanguage) {
            return [];
        }

        return [movie.originalLanguage];
    }
}

export const OriginalLanguagePredicateBuilder: PredicateBuilder = {
    key: 'originalLanguage',
    build: (data: OriginalLanguageOptions) => {
        const parameters = {
            terms: Array.isArray(data.originalLanguage) ? data.originalLanguage : [data.originalLanguage],
        };
        return new OriginalLanguagePredicate(parameters);
    },
};
