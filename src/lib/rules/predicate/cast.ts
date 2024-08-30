import { MovieDetails } from '@core/api/overseerr/interfaces';
import { PredicateBuilder } from '@core/lib/rules';
import { CastOptions } from '@core/lib/rules/interfaces';
import { TagsPredicate, TagsPredicateParameters } from '@core/lib/rules/predicate/tag';

export type CastPredicateParameters = TagsPredicateParameters & {
    excludeVoice: boolean;
};

export class CastPredicate extends TagsPredicate {
    private excludeVoice: boolean = false;

    constructor(options: CastPredicateParameters) {
        super(options);
        this.excludeVoice = options.excludeVoice;
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
    build: (data: CastOptions) => {
        const parameters: CastPredicateParameters = {
            terms: Array.isArray(data.cast) ? data.cast : data.cast.names,
            excludeVoice: Array.isArray(data.cast) ? false : data.cast.voice?.toLowerCase() === 'exclude',
        };
        return new CastPredicate(parameters);
    },
};
