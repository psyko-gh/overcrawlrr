import { MovieDetails } from '@core/api/overseerr/interfaces';
import TagsPredicate from '@core/lib/rules/predicate/tag';
import { PredicateBuilder } from '@core/lib/rules';
import { CastOptions } from '@core/lib/rules/interfaces';

export class CastPredicate extends TagsPredicate {
    constructor(options: CastOptions) {
        super({
            terms: options.cast,
        });
    }

    getTags(movie: MovieDetails): string[] {
        if (!movie.credits || !movie.credits.cast) {
            return [];
        }
        const tags: string[] = [];
        for (const cast of movie.credits.cast) {
            tags.push(cast.name);
        }
        return tags;
    }
}

export const CastPredicateBuilder: PredicateBuilder = {
    key: 'cast',
    build: (data: CastOptions) => new CastPredicate(data),
};
