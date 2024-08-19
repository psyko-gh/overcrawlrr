import {MovieDetails} from "@core/api/overseerr/interfaces";
import TagsPredicate, {TagsPredicateOptions} from "@core/lib/rules/predicate/tag";
import {PredicateBuilder} from "@core/lib/rules";

export type CastOptions = {

} & TagsPredicateOptions;

export class CastPredicate extends TagsPredicate {

    constructor(options: CastOptions) {
        super(options);
    }

    getTags(movie: MovieDetails): string[] {
        if (!movie.credits || !movie.credits.cast) {
            return []
        }
        const tags: string[] = [];
        for (const cast of movie.credits.cast) {
            tags.push(cast.name);
        }
        return tags;
    }

}

export const CastPredicateBuilder:PredicateBuilder = {
    key: 'cast',
    build: (data:string[]) => {
        if (!Array.isArray(data)) {
            throw new Error('Error while building Cast filter. Expecting a list of name...')
        }
        return new CastPredicate({ terms: data })
    }
}