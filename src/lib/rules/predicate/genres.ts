import {MovieDetails} from "@core/api/overseerr/interfaces";
import {PredicateBuilder} from "@core/lib/rules";
import TagsPredicate from "@core/lib/rules/predicate/tag";
import {GenreOptions} from "@core/lib/rules/interfaces";

export class GenresPredicate extends TagsPredicate {

    constructor(options: GenreOptions) {
        super({terms: Array.isArray(options.genre) ? options.genre : [options.genre]});
    }

    getTags(movie: MovieDetails): string[] {
        if (!movie.genres) {
            return []
        }

        return movie.genres.map(g => g.name.toLowerCase());
    }

}

export const GenresPredicateBuilder:PredicateBuilder = {
    key: 'genre',
    build: (data: GenreOptions) => new GenresPredicate(data)
}