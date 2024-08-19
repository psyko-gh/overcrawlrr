import {Predicate, PredicateBuilder, PredicateKey} from "@core/lib/rules/index";
import {PredicateOption} from "@core/lib/rules/interfaces";
import {AgePredicateBuilder, ScorePredicateBuilder, VoteCountPredicateBuilder} from "@core/lib/rules/predicate";
import {WatchProvidersPredicateBuilder} from "@core/lib/rules/predicate/watchproviders";
import {GenresPredicateBuilder} from "@core/lib/rules/predicate/genres";
import {CastPredicateBuilder} from "@core/lib/rules/predicate/cast";
import {CrewPredicateBuilder} from "@core/lib/rules/predicate/crew";
import {ProductionCompanyPredicateBuilder} from "@core/lib/rules/predicate/productionCompany";
import {ReleasedPredicateBuilder} from "@core/lib/rules/predicate/released";
import {KeywordPredicateBuilder} from "@core/lib/rules/predicate/keywords";
import {OrPredicateBuilder} from "@core/lib/rules/predicate/or";
import {AndPredicateBuilder} from "@core/lib/rules/predicate/and";
import {NotPredicateBuilder} from "@core/lib/rules/predicate/not";
import logger from "@core/log";

class PredicateFactoryClass {
    private builders: Map<PredicateKey, PredicateBuilder>;

    constructor() {
        this.builders = new Map<PredicateKey, PredicateBuilder>();
    }

    public buildPredicates(predicates: PredicateOption[]): Predicate[] {
        return predicates.map(p => {
            const key = Object.keys(p)[0];
            const data = (p as any)[key];
            return this.getBuilder(key).build(data);
        });
    }

    public init() {
        logger.debug('Initialized PredicateFactory')
    }

    private getBuilder(key: string): PredicateBuilder {
        if (!this.builders.has(key)) {
            throw new Error(`No predicate builder found for key '${key}'`)
        }
        return this.builders.get(key)!;
    }

    public registerBuilder(builder: PredicateBuilder) {
        if (this.builders.has(builder.key)) {
            throw new Error(`Duplicate predicate builder for key '${builder.key}'`)
        }
        this.builders.set(builder.key, builder);
    }
}

export const PredicateFactory = new PredicateFactoryClass();
const builders = [
    AndPredicateBuilder,
    OrPredicateBuilder,
    NotPredicateBuilder,
    AgePredicateBuilder,
    ScorePredicateBuilder,
    VoteCountPredicateBuilder,
    WatchProvidersPredicateBuilder,
    GenresPredicateBuilder,
    CastPredicateBuilder,
    CrewPredicateBuilder,
    ProductionCompanyPredicateBuilder,
    ReleasedPredicateBuilder,
    KeywordPredicateBuilder
];
builders.forEach(b => PredicateFactory.registerBuilder(b))