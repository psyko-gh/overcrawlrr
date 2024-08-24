import { Predicate, PredicateBuilder, PredicateKey } from '@core/lib/rules/index';
import { PredicateOption } from '@core/lib/rules/interfaces';
import { AgePredicateBuilder } from '@core/lib/rules/predicate/age';
import { ScorePredicateBuilder } from '@core/lib/rules/predicate/score';
import { VoteCountPredicateBuilder } from '@core/lib/rules/predicate/voteCount';
import { WatchProvidersPredicateBuilder } from '@core/lib/rules/predicate/watchproviders';
import { GenrePredicateBuilder } from '@core/lib/rules/predicate/genre';
import { CastPredicateBuilder } from '@core/lib/rules/predicate/cast';
import { CrewPredicateBuilder } from '@core/lib/rules/predicate/crew';
import { ProductionCompanyPredicateBuilder } from '@core/lib/rules/predicate/productionCompany';
import { ReleasedPredicateBuilder } from '@core/lib/rules/predicate/released';
import { KeywordPredicateBuilder } from '@core/lib/rules/predicate/keywords';
import { OrPredicateBuilder } from '@core/lib/rules/predicate/or';
import { AndPredicateBuilder } from '@core/lib/rules/predicate/and';
import { NotPredicateBuilder } from '@core/lib/rules/predicate/not';
import { AdultPredicateBuilder } from '@core/lib/rules/predicate/adult';
import { RuntimePredicateBuilder } from '@core/lib/rules/predicate/runtime';

export class PredicateFactoryClass {
    private builders: Map<PredicateKey, PredicateBuilder>;

    constructor() {
        this.builders = new Map<PredicateKey, PredicateBuilder>();
    }

    public buildPredicates(predicateOptions: PredicateOption[]): Predicate[] {
        return predicateOptions.map((p: PredicateOption) => {
            const key = Object.keys(p)[0];
            return this.getBuilder(key).build(p, this);
        });
    }

    private getBuilder(key: string): PredicateBuilder {
        if (!this.builders.has(key)) {
            throw new Error(`No predicate builder found for key '${key}'`);
        }
        return this.builders.get(key)!;
    }

    public registerBuilder(builder: PredicateBuilder) {
        if (this.builders.has(builder.key)) {
            throw new Error(`Duplicate predicate builder for key '${builder.key}'`);
        }
        this.builders.set(builder.key, builder);
    }
}

export const PredicateFactory = new PredicateFactoryClass();
const builders = [
    OrPredicateBuilder,
    AndPredicateBuilder,
    NotPredicateBuilder,
    AgePredicateBuilder,
    ScorePredicateBuilder,
    VoteCountPredicateBuilder,
    WatchProvidersPredicateBuilder,
    GenrePredicateBuilder,
    CastPredicateBuilder,
    CrewPredicateBuilder,
    ProductionCompanyPredicateBuilder,
    ReleasedPredicateBuilder,
    RuntimePredicateBuilder,
    KeywordPredicateBuilder,
    AdultPredicateBuilder,
];
builders.forEach((b) => PredicateFactory.registerBuilder(b));
