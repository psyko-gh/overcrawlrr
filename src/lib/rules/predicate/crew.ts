import { MovieDetails } from '@core/api/overseerr/interfaces';
import { PredicateBuilder } from '@core/lib/rules';
import { TagsPredicate, TagsPredicateParameters } from '@core/lib/rules/predicate/tag';
import { CrewOptions } from '@core/lib/rules/interfaces';

export type CrewPredicateParameters = TagsPredicateParameters & {
    job?: string;
};

export class CrewPredicate extends TagsPredicate {
    private job?: string;

    constructor(parameters: CrewPredicateParameters) {
        super(parameters);
        this.job = parameters.job;
    }

    getTags(movie: MovieDetails): string[] {
        if (!movie.credits || !movie.credits.crew) {
            return [];
        }
        const tags: string[] = [];
        for (const crew of movie.credits.crew) {
            if (!this.job || this.job.toLowerCase() === crew.job.toLowerCase()) {
                tags.push(crew.name);
            }
        }
        return tags;
    }
}

export const CrewPredicateBuilder: PredicateBuilder = {
    key: 'crew',
    build: (data: CrewOptions) => {
        const parameters = {
            terms: Array.isArray(data.crew) ? data.crew : data.crew.names,
            job: Array.isArray(data.crew) ? undefined : data.crew.job,
        };
        return new CrewPredicate(parameters);
    },
};
