import { MovieDetails } from '@core/api/overseerr/interfaces';
import TagsPredicate from '@core/lib/rules/predicate/tag';
import { PredicateBuilder } from '@core/lib/rules';
import { CastOptions } from '@core/lib/rules/interfaces';

export class CastPredicate extends TagsPredicate {
    private excludeVoice: boolean = false;

    constructor(options: CastOptions) {
        super({
            terms: Array.isArray(options.cast) ? options.cast : options.cast.names,
        });
        this.excludeVoice = Array.isArray(options.cast) ? false : options.cast.voice?.toLowerCase() === 'exclude';
    }

    getTags(movie: MovieDetails): string[] {
        if (!movie.credits || !movie.credits.cast) {
            return [];
        }
        const tags: string[] = [];
        for (const cast of movie.credits.cast) {
            if (!this.excludeVoice || !cast.character || !cast.character.toLowerCase().includes('(voice)')) {
                tags.push(cast.name);
            }
        }
        return tags;
    }
}

export const CastPredicateBuilder: PredicateBuilder = {
    key: 'cast',
    build: (data: CastOptions) => new CastPredicate(data),
};
