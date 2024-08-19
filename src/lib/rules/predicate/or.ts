import {Predicate, PredicateBuilder} from "@core/lib/rules";
import {PredicateFactory} from "@core/lib/rules/factory";
import {MovieDetails} from "@core/api/overseerr/interfaces";
import {PredicateOption} from "@core/lib/rules/interfaces";
import {GroupPredicate} from "@core/lib/rules/predicate/group";

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
    build: (data: any) => new OrPredicate(PredicateFactory.buildPredicates(data as PredicateOption[])),
};