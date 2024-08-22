export type RuleAction = 'accept' | 'reject';

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
    | AgeOptions
    | CastOptions
    | CrewOptions
    | GenreOptions
    | KeywordOptions
    | ProductionCompanyOptions
    | ReleasedOptions
    | ScoreOptions
    | VoteCountOptions
    | WatchProvidersOptions;

export interface AndFilterOptions {
    and: PredicateOption[];
}

export interface OrFilterOptions {
    or: PredicateOption[];
}

export interface NotFilterOptions {
    not: PredicateOption[];
}

export type AgeOptions = {
    age: string;
};

export type CastOptions = {
    cast: string[];
};

export type GenreOptions = {
    genre: string | string[];
};

export type VoteCountOptions = {
    voteCount: string;
};

export type KeywordOptions = {
    keyword: string | string[];
};

export type ProductionCompanyOptions = {
    productionCompany: string | string[];
};

export type ReleasedOptions = {
    released: string;
};

export type ScoreOptions = {
    score: string;
};

export type WatchProvidersOptions = {
    watchProviders: WatchProvidersSubOptions;
};

export type WatchProvidersSubOptions = {
    region: string;
    names: string[];
};

export interface CrewOptions {
    crew: string[] | CrewJobNamesOptions;
}

export type CrewJobNamesOptions = {
    job: string;
    names: string[];
};
