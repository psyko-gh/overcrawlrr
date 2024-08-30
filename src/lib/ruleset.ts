import logger from '../log';
import { Rule, RuleEvaluation } from '@core/lib/rules';
import { RulesetOptions } from '@core/lib/rules/interfaces';
import { MovieDetails } from '@core/api/overseerr/interfaces';
import Settings from '@core/lib/settings';
import { PredicateFactory } from '@core/lib/rules/factory';

class Ruleset {
    private _rulesetOptions: RulesetOptions;
    private _rules: Rule[];
    private initialized: boolean;

    constructor(options: RulesetOptions) {
        this.initialized = false;
        this._rulesetOptions = options;
        this._rules = [];
    }

    public load(): Ruleset {
        if (this.initialized) {
            return this;
        }
        try {
            this.buildRules();
            this.initialized = true;
            logger.info(`Successfully loaded ruleset '${this.name}' with ${this._rules.length} rules`);
        } catch (e) {
            logger.error(e);
        }
        return this;
    }

    get name() {
        return this._rulesetOptions.name;
    }

    get extendedRulesetName(): string | undefined {
        return this._rulesetOptions.extends;
    }

    private buildRules(): void {
        this._rules = this._rulesetOptions.rules.map((o) => new Rule(o.name, PredicateFactory.buildPredicates(o.whenMatch), o.action));
    }

    public evaluateRules(movie: MovieDetails): RuleEvaluation {
        if (this.extendedRulesetName) {
            const extendedRuleSet = getRuleset(this.extendedRulesetName);
            const extendedEvaluation = extendedRuleSet.evaluateRules(movie);
            if (extendedEvaluation.result !== 'skip') {
                return extendedEvaluation;
            }
        }

        for (const rule of this._rules) {
            const evaluation = rule.apply(movie);
            if (evaluation.result !== 'skip') {
                return evaluation;
            }
        }
        return { movie, result: 'skip' };
    }

    get rules(): Rule[] {
        return this._rules;
    }
}

let rulesets: Map<string, Ruleset>;

export const loadRulesets = (settings: Settings): void => {
    try {
        logger.info('Loading rulesets...');
        rulesets = new Map<string, Ruleset>();
        const configuration = settings.rulesets;
        for (const options of configuration) {
            if (rulesets.has(options.name)) {
                throw new Error(`Ruleset '${options.name}' already defined`);
            }

            const ruleset = new Ruleset(options);
            ruleset.load();
            rulesets.set(ruleset.name, ruleset);
        }
    } catch (e: unknown) {
        console.log(e);
    }
};

export const getRuleset = (name: string): Ruleset => {
    if (!rulesets.has(name)) {
        throw new Error(`Ruleset '${name}' does not exist`);
    }
    return <Ruleset>rulesets.get(name);
};

export default Ruleset;
