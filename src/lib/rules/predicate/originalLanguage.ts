import { MovieDetails } from '@core/api/overseerr/interfaces';
import { PredicateBuilder } from '@core/lib/rules';
import TagsPredicate from '@core/lib/rules/predicate/tag';
import { OriginalLanguageOptions } from '@core/lib/rules/interfaces';

export class OriginalLanguagePredicate extends TagsPredicate {
    constructor(options: OriginalLanguageOptions) {
        super({
            terms: Array.isArray(options.originalLanguage) ? options.originalLanguage : [options.originalLanguage],
        });
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
    build: (data: OriginalLanguageOptions) => new OriginalLanguagePredicate(data),
};
