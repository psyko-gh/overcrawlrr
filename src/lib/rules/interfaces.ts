export type RuleAction = 'accept' | 'reject'

export interface RulesetOptions {
    name: string;
    extends: string;
    rules: RuleOptions[];
}

export interface RuleOptions {
    name: string;
    whenMatch: PredicateOption[];
    action: RuleAction;
}

export type PredicateOption =
    | AndFilterOptions
    | OrFilterOptions
    | NotFilterOptions
    | FilterOptions

export interface FilterOptions {
    [key: string]: string|string[];
}

export interface AndFilterOptions {
    and: FilterOptions[]
}

export interface OrFilterOptions {
    or: FilterOptions[]
}

export interface NotFilterOptions {
    not: FilterOptions[]
}
