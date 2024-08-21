import { Predicate, PredicateBuilder } from '@core/lib/rules';
import { MovieDetails } from '@core/api/overseerr/interfaces';
import { GroupPredicate } from '@core/lib/rules/predicate/group';
import { AndFilterOptions } from '@core/lib/rules/interfaces';
import type { PredicateFactoryClass } from '@core/lib/rules/factory';

export class AndPredicate extends GroupPredicate {
    constructor(children: Predicate[]) {
        super(children);
    }

    matches(movie: MovieDetails): boolean {
        return this.children.every((p) => p.matches(movie));
    }
}

export const AndPredicateBuilder: PredicateBuilder = {
    key: 'and',
    build: (data: AndFilterOptions, factory: PredicateFactoryClass) => new AndPredicate(factory.buildPredicates(data.and)),
};
