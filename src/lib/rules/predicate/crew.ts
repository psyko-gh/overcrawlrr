import {MovieDetails} from "@core/api/overseerr/interfaces";
import {PredicateBuilder} from "@core/lib/rules";
import TagsPredicate, {TagsPredicateOptions} from "@core/lib/rules/predicate/tag";

export type CrewOptions = {
    job?: string;
} & TagsPredicateOptions;

export class CrewPredicate extends TagsPredicate {
    private job?: string;

    constructor(options: CrewOptions) {
        super(options);
        this.job = options.job?.toLowerCase() ?? undefined;
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

export type CrewPredicateBuilderData = {
    job?: string;
    names: string[];
};

export const CrewPredicateBuilder:PredicateBuilder = {
    key: 'crew',
    build: (data: string[] | CrewPredicateBuilderData) => {
        if (Array.isArray(data)) {
            return new CrewPredicate({ terms: data })
        }
        return new CrewPredicate({ job: data.job, terms: data.names })
    }
}