import { MovieDetails } from '@core/api/overseerr/interfaces';
import { PredicateOption, RuleAction } from '@core/lib/rules/interfaces';
import { PredicateFactoryClass } from '@core/lib/rules/factory';

export abstract class Predicate {
    abstract matches(_movie: MovieDetails): boolean;
}
export type PredicateKey = string;

export interface PredicateBuilder {
    key: PredicateKey;
    build(_data: PredicateOption, _factory: PredicateFactoryClass): Predicate;
}

export type RuleResult = 'accept' | 'reject' | 'skip';

export type RuleEvaluation = {
    rule?: Rule;
    movie: MovieDetails;
    result: RuleResult;
};

export class Rule {
    public name: string;
    public filter: Predicate[];
    public action: RuleAction;

    constructor(name: string, filter: Predicate[], action: RuleAction) {
        this.name = name;
        this.filter = filter;
        this.action = action;
    }

    public matches(movie: MovieDetails): boolean {
        return this.filter.every((p) => p.matches(movie));
    }

    public apply(movie: MovieDetails): RuleEvaluation {
        const match = this.matches(movie);
        return {
            rule: this,
            movie: movie,
            result: match ? this.action : 'skip',
        };
    }
}
