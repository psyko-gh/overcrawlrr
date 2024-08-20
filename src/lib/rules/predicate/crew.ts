import {MovieDetails} from "@core/api/overseerr/interfaces";
import {PredicateBuilder} from "@core/lib/rules";
import TagsPredicate from "@core/lib/rules/predicate/tag";
import {CrewOptions} from "@core/lib/rules/interfaces";

export class CrewPredicate extends TagsPredicate {
    private job?: string;

    constructor(options: CrewOptions) {
        super({terms: Array.isArray(options.crew) ? options.crew : options.crew.names});
        this.job = Array.isArray(options.crew) ? undefined : options.crew.job;
    }

    getTags(movie: MovieDetails): string[] {
        if (!movie.credits || !movie.credits.crew) {
            return []
        }
        const tags: string[] = [];
        for (const crew of movie.credits.crew) {
            if (!this.job || this.job === crew.job.toLowerCase()) {
                tags.push(crew.name);
            }
        }
        return tags;
    }

}

export const CrewPredicateBuilder:PredicateBuilder = {
    key: 'crew',
    build: (data: CrewOptions) => new CrewPredicate(data)
}