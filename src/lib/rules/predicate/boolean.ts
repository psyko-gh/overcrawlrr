import { Predicate } from '@core/lib/rules';

export interface BooleanPredicateOptions {
    value: string | boolean;
}

export abstract class BooleanPredicate extends Predicate {
    protected targetValue: boolean;

    protected constructor(options: BooleanPredicateOptions) {
        super();
        this.targetValue = typeof options.value === 'boolean' ? options.value : fromHumanReadableBoolean(options.value);
    }
}

export const fromHumanReadableBoolean = (str: string): boolean => {
    const acceptableTrueBoolean = ['yes', 'true', '1'];
    return acceptableTrueBoolean.includes(str);
};
