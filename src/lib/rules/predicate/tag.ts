import {Predicate} from "@core/lib/rules";
import {MovieDetails} from "@core/api/overseerr/interfaces";

export type TagsPredicateOptions = {
    terms: string[]
};

export abstract class TagsPredicate extends Predicate {
    private terms: string[];

    protected constructor(options: TagsPredicateOptions) {
        super();
        this.terms = options.terms;
    }

    abstract getTags(movie: MovieDetails): string[];

    matches(movie: MovieDetails): boolean {
        const tags = this.getTags(movie).map(e => e.toLowerCase());
        return this.terms.some(t => tags.includes(t.toLowerCase()));
    }
}

export default TagsPredicate;
