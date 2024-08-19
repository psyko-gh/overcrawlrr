import {MovieDetails} from "@core/api/overseerr/interfaces";
import {PredicateBuilder} from "@core/lib/rules";
import TagsPredicate, {TagsPredicateOptions} from "@core/lib/rules/predicate/tag";

export type KeywordOptions = {

} & TagsPredicateOptions;

export class KeywordPredicate extends TagsPredicate {

    constructor(options: KeywordOptions) {
        super(options);
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
    build: (data:string[]) => {
        if (!Array.isArray(data)) {
            throw new Error('Error while building Keyword filter. Expecting a list of keyword...')
        }
        return new KeywordPredicate({ terms: data })
    }
}