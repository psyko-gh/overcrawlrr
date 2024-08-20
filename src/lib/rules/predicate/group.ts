import { Predicate } from '@core/lib/rules';

export abstract class GroupPredicate extends Predicate {
    protected children: Predicate[];

    protected constructor(children: Predicate[]) {
        super();
        this.children = children;
    }
}
