import {MovieDetails} from "@core/api/overseerr/interfaces";
import {PredicateBuilder} from "@core/lib/rules";
import TagsPredicate, {TagsPredicateOptions} from "@core/lib/rules/predicate/tag";

export class GenresPredicate extends TagsPredicate {

    constructor(options: TagsPredicateOptions) {
        super(options);
    }

    getTags(movie: MovieDetails): string[] {
        if (!movie.genres) {
            return []
        }

        return movie.genres.map(g => g.name.toLowerCase());
    }

}

export const GenresPredicateBuilder:PredicateBuilder = {
    key: 'genres',
    build: (genres: string[]) => new GenresPredicate({terms: genres})
}