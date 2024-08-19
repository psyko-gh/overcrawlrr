import {PredicateBuilder} from "@core/lib/rules";
import {MovieDetails} from "@core/api/overseerr/interfaces";
import {BooleanPredicate, BooleanPredicateOptions} from "@core/lib/rules/predicate/boolean";
import {TagsPredicateOptions} from "@core/lib/rules/predicate/tag";

export type ReleasedOptions = {

} & BooleanPredicateOptions;

export class ReleasedPredicate extends BooleanPredicate {

    constructor(options: ReleasedOptions) {
        super(options);
    }

    matches(movie: MovieDetails): boolean {
        if (movie.status) {
            const released = movie.status.toLowerCase() === 'released';
            return released == this.targetValue;
        } else if (movie.releaseDate) {
            const movieReleaseDate = new Date(movie.releaseDate);
            const released = movieReleaseDate.getTime() < Date.now();
            return released == this.targetValue;
        }
        return false;
    }
}

export const ReleasedPredicateBuilder:PredicateBuilder = {
    key: 'released',
    build: (data: string) => new ReleasedPredicate({ value: data })
}
