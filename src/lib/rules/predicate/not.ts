import {Predicate, PredicateBuilder} from "@core/lib/rules";
import {PredicateFactory} from "@core/lib/rules/factory";
import {MovieDetails} from "@core/api/overseerr/interfaces";
import {PredicateOption} from "@core/lib/rules/interfaces";
import {GroupPredicate} from "@core/lib/rules/predicate/group";

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
    build: (data: any) => new NotPredicate(PredicateFactory.buildPredicates(data as PredicateOption[]))
};