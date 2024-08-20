import {Predicate, PredicateBuilder} from "@core/lib/rules";
import {MovieDetails} from "@core/api/overseerr/interfaces";
import {GroupPredicate} from "@core/lib/rules/predicate/group";
import {NotFilterOptions} from "@core/lib/rules/interfaces";
import type {PredicateFactoryClass} from "@core/lib/rules/factory";

export class NotPredicate extends GroupPredicate {
    constructor(children: Predicate[]) {
        super(children);
    }

    matches(movie: MovieDetails): boolean {
        return !this.children.every(p => p.matches(movie));
    }
}

export const NotPredicateBuilder: PredicateBuilder = {
    key: 'not',
    build: (data: NotFilterOptions, factory: PredicateFactoryClass) => new NotPredicate(factory.buildPredicates(data.not))
};