import { PredicateFactory } from '@core/lib/rules/factory';
import yaml from 'js-yaml';
import { PredicateOption } from '@core/lib/rules/interfaces';
import { AdultPredicate } from '@core/lib/rules/predicate/adult';
import { AgePredicate } from '@core/lib/rules/predicate/age';
import { CastPredicate } from '@core/lib/rules/predicate/cast';
import { CrewPredicate } from '@core/lib/rules/predicate/crew';
import { GenrePredicate } from '@core/lib/rules/predicate/genre';
import { KeywordPredicate } from '@core/lib/rules/predicate/keywords';
import { OriginalLanguagePredicate } from '@core/lib/rules/predicate/originalLanguage';
import { ProductionCompanyPredicate } from '@core/lib/rules/predicate/productionCompany';
import { ReleasedPredicate } from '@core/lib/rules/predicate/released';
import { RuntimePredicate } from '@core/lib/rules/predicate/runtime';
import { ScorePredicate } from '@core/lib/rules/predicate/score';
import { StatusPredicate } from '@core/lib/rules/predicate/status';
import { VoteCountPredicate } from '@core/lib/rules/predicate/voteCount';
import { WatchprovidersPredicate } from '@core/lib/rules/predicate/watchproviders';

const from = (data: string) => {
    const options = yaml.load(data) as PredicateOption;
    const [head] = PredicateFactory.buildPredicates([options]);
    return head;
};

const expectPredicate = (data: string) => {
    return expect(from(data));
};

describe('AdultPredicateBuilder', () => {
    it('should match', async () => {
        expectPredicate(`adult: yes`).toEqual(new AdultPredicate({ value: true }));
        expectPredicate(`adult: true`).toEqual(new AdultPredicate({ value: true }));

        expectPredicate(`adult: no`).toEqual(new AdultPredicate({ value: false }));
        expectPredicate(`adult: false`).toEqual(new AdultPredicate({ value: false }));
    });
});

describe('AgePredicateBuilder', () => {
    it('should match', async () => {
        expectPredicate(`age: less than 1 minute`).toEqual(new AgePredicate({ operator: 'lt', threshold: 60 }));
        expectPredicate(`age: less than 1 minutes`).toEqual(new AgePredicate({ operator: 'lt', threshold: 60 }));
        expectPredicate(`age: more than 1 minute`).toEqual(new AgePredicate({ operator: 'gt', threshold: 60 }));
        expectPredicate(`age: more than 1 minutes`).toEqual(new AgePredicate({ operator: 'gt', threshold: 60 }));
    });
});

describe('CastPredicateBuilder', () => {
    it('should match', async () => {
        expectPredicate(`
            cast:
                - Korben Dallas
                - Dumbo
        `).toEqual(new CastPredicate({ terms: ['Korben Dallas', 'Dumbo'], excludeVoice: false }));
        expectPredicate(`
            cast:
                voice: exclude
                names:
                    - Korben Dallas
                    - Dumbo
        `).toEqual(new CastPredicate({ terms: ['Korben Dallas', 'Dumbo'], excludeVoice: true }));
    });
});

describe('CrewPredicateBuilder', () => {
    it('should match', async () => {
        expectPredicate(`
            crew:
                - Korben Dallas
                - Dumbo
        `).toEqual(new CrewPredicate({ terms: ['Korben Dallas', 'Dumbo'], job: undefined }));
        expectPredicate(`
            crew:
                job: dummy
                names:
                    - Korben Dallas
                    - Dumbo
        `).toEqual(new CrewPredicate({ terms: ['Korben Dallas', 'Dumbo'], job: 'dummy' }));
    });
});

describe('GenrePredicateBuilder', () => {
    it('should match', async () => {
        expectPredicate(`
            genre: Comedy
        `).toEqual(new GenrePredicate({ terms: ['Comedy'] }));
        expectPredicate(`
            genre:
                - Comedy
                - Romance
        `).toEqual(new GenrePredicate({ terms: ['Comedy', 'Romance'] }));
    });
});

describe('KeywordPredicateBuilder', () => {
    it('should match', async () => {
        expectPredicate(`
            keyword: Comedy
        `).toEqual(new KeywordPredicate({ terms: ['Comedy'] }));
        expectPredicate(`
            keyword:
                - space
                - futuristic
        `).toEqual(new GenrePredicate({ terms: ['space', 'futuristic'] }));
    });
});

describe('OriginalLanguagePredicateBuilder', () => {
    it('should match', async () => {
        expectPredicate(`
            originalLanguage: en
        `).toEqual(new OriginalLanguagePredicate({ terms: ['en'] }));
        expectPredicate(`
            originalLanguage:
                - de
                - en
        `).toEqual(new OriginalLanguagePredicate({ terms: ['de', 'en'] }));
    });
});

describe('ProductionCompanyPredicateBuilder', () => {
    it('should match', async () => {
        expectPredicate(`
            productionCompany: Warner Bros.
        `).toEqual(new ProductionCompanyPredicate({ terms: ['Warner Bros.'] }));
        expectPredicate(`
            productionCompany:
                - Warner Bros.
                - 20th Century Fox
        `).toEqual(new ProductionCompanyPredicate({ terms: ['Warner Bros.', '20th Century Fox'] }));
    });
});

describe('ReleasedPredicateBuilder', () => {
    it('should match', async () => {
        expectPredicate(`released: yes`).toEqual(new ReleasedPredicate({ value: true }));
        expectPredicate(`released: true`).toEqual(new ReleasedPredicate({ value: true }));

        expectPredicate(`released: no`).toEqual(new ReleasedPredicate({ value: false }));
        expectPredicate(`released: false`).toEqual(new ReleasedPredicate({ value: false }));
    });
});

describe('RuntimePredicateBuilder', () => {
    it('should match', async () => {
        expectPredicate(`runtime: less than 1 hour`).toEqual(new RuntimePredicate({ operator: 'lt', threshold: 60 * 60 }));
        expectPredicate(`runtime: less than 1 hours`).toEqual(new RuntimePredicate({ operator: 'lt', threshold: 60 * 60 }));

        expectPredicate(`runtime: more than 3 hour`).toEqual(new RuntimePredicate({ operator: 'gt', threshold: 3 * 60 * 60 }));
        expectPredicate(`runtime: more than 3 hours`).toEqual(new RuntimePredicate({ operator: 'gt', threshold: 3 * 60 * 60 }));
    });
});

describe('ScorePredicateBuilder', () => {
    it('should match', async () => {
        expectPredicate(`score: above 8`).toEqual(new ScorePredicate({ operator: 'gt', threshold: 8 }));
        expectPredicate(`score: above 8.4`).toEqual(new ScorePredicate({ operator: 'gt', threshold: 8.4 }));
        expectPredicate(`score: above 85/100`).toEqual(new ScorePredicate({ operator: 'gt', threshold: 8.5 }));

        expectPredicate(`score: below 8`).toEqual(new ScorePredicate({ operator: 'lt', threshold: 8 }));
        expectPredicate(`score: below 8.4`).toEqual(new ScorePredicate({ operator: 'lt', threshold: 8.4 }));
        expectPredicate(`score: below 85/100`).toEqual(new ScorePredicate({ operator: 'lt', threshold: 8.5 }));
    });
});

describe('StatusPredicateBuilder', () => {
    it('should match', async () => {
        expectPredicate(`
            status: status 1
        `).toEqual(new StatusPredicate({ terms: ['status 1'] }));
        expectPredicate(`
            status:
                - status 1
                - status 2
        `).toEqual(new StatusPredicate({ terms: ['status 1', 'status 2'] }));
    });
});

describe('VoteCountPredicateBuilder', () => {
    it('should match', async () => {
        expectPredicate(`voteCount: greater than 1000`).toEqual(new VoteCountPredicate({ operator: 'gt', threshold: 1000 }));
        expectPredicate(`voteCount: above 84`).toEqual(new ScorePredicate({ operator: 'gt', threshold: 84 }));
        expectPredicate(`voteCount: above 84.32`).toEqual(new ScorePredicate({ operator: 'gt', threshold: 84.32 }));

        expectPredicate(`voteCount: below 8`).toEqual(new ScorePredicate({ operator: 'lt', threshold: 8 }));
        expectPredicate(`voteCount: under 85`).toEqual(new ScorePredicate({ operator: 'lt', threshold: 85 }));
        expectPredicate(`voteCount: less than 100`).toEqual(new ScorePredicate({ operator: 'lt', threshold: 100 }));
    });
});

describe('WatchProvidersPredicateBuilder', () => {
    it('should match', async () => {
        expectPredicate(`
            watchProviders:
                region: us
                names:
                    - Platform 1
                    - Platform 2
        `).toEqual(new WatchprovidersPredicate({ terms: ['Platform 1', 'Platform 2'], region: 'us' }));
    });
});
