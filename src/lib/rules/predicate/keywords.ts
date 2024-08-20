import {MovieDetails} from "@core/api/overseerr/interfaces";
import {PredicateBuilder} from "@core/lib/rules";
import TagsPredicate from "@core/lib/rules/predicate/tag";
import {KeywordOptions} from "@core/lib/rules/interfaces";

export class KeywordPredicate extends TagsPredicate {

    constructor(options: KeywordOptions) {
        super({terms: Array.isArray(options.keyword) ? options.keyword : [options.keyword]});
    }

    getTags(movie: MovieDetails): string[] {
        if (!movie.keywords) {
            return []
        }
        const tags: string[] = [];
        for (const keywords of movie.keywords) {
            tags.push(keywords.name);
        }
        return tags;
    }

}

export const KeywordPredicateBuilder:PredicateBuilder = {
    key: 'keyword',
    build: (data: KeywordOptions) =>  new KeywordPredicate(data)
}