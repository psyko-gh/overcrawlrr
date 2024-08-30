import { Predicate } from '@core/lib/rules';

export interface BooleanPredicateParameters {
    value: boolean;
}

export abstract class BooleanPredicate extends Predicate {
    protected targetValue: boolean;

    protected constructor(options: BooleanPredicateParameters) {
        super();
        this.targetValue = options.value;
    }
}

export const fromHumanReadableBoolean = (str: string): boolean => {
    const acceptableTrueBoolean = ['yes', 'true'];
    return acceptableTrueBoolean.includes(str);
};
