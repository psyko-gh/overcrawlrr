import {Predicate, PredicateBuilder} from "@core/lib/rules";
import {MovieDetails} from "@core/api/overseerr/interfaces";
import {GroupPredicate} from "@core/lib/rules/predicate/group";
import {OrFilterOptions} from "@core/lib/rules/interfaces";
import type {PredicateFactoryClass} from "@core/lib/rules/factory";

export class OrPredicate extends GroupPredicate {

    constructor(children: Predicate[]) {
        super(children);
    }

    matches(movie: MovieDetails): boolean {
        return this.children.some(p => p.matches(movie));
    }
}

export const OrPredicateBuilder: PredicateBuilder = {
    key: 'or',
    build: (data: OrFilterOptions, factory: PredicateFactoryClass) => new OrPredicate(factory.buildPredicates(data.or)),
};