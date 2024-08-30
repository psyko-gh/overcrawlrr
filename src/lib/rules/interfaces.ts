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
    | AdultOptions
    | AgeOptions
    | CastOptions
    | CrewOptions
    | GenreOptions
    | KeywordOptions
    | OriginalLanguageOptions
    | ProductionCompanyOptions
    | ReleasedOptions
    | RuntimeOptions
    | ScoreOptions
    | StatusOptions
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

export type AdultOptions = {
    adult: string | boolean;
};

export type AgeOptions = {
    age: string;
};

export type CastOptions = {
    cast: string[] | CastWithVoiceOptions;
};

export type CastWithVoiceOptions = {
    voice: 'include' | 'exclude';
    names: string[];
};

export type GenreOptions = {
    genre: string | string[];
};

export type OriginalLanguageOptions = {
    originalLanguage: string | string[];
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
    released: string | boolean;
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

export type RuntimeOptions = {
    runtime: string;
};

export type StatusOptions = {
    status: string | string[];
};
