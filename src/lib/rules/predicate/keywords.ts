import { MovieDetails } from '@core/api/overseerr/interfaces';
import { PredicateBuilder } from '@core/lib/rules';
import { TagsPredicate, TagsPredicateParameters } from '@core/lib/rules/predicate/tag';
import { KeywordOptions } from '@core/lib/rules/interfaces';

export type KeywordPredicateParameters = TagsPredicateParameters;

export class KeywordPredicate extends TagsPredicate {
    constructor(options: KeywordPredicateParameters) {
        super(options);
    }

    getTags(movie: MovieDetails): string[] {
        if (!movie.keywords) {
            return [];
        }
        const tags: string[] = [];
        for (const keywords of movie.keywords) {
            tags.push(keywords.name);
        }
        return tags;
    }
}

export const KeywordPredicateBuilder: PredicateBuilder = {
    key: 'keyword',
    build: (data: KeywordOptions) => {
        const parameters = {
            terms: Array.isArray(data.keyword) ? data.keyword : [data.keyword],
        };
        return new KeywordPredicate(parameters);
    },
};
