import { Predicate, Rule } from '@core/lib/rules';
import { FalsePredicate, TruePredicate } from '@core/lib/rules/predicate';
import { GenrePredicate } from '@core/lib/rules/predicate/genre';
import { CastPredicate } from '@core/lib/rules/predicate/cast';
import { CrewPredicate } from '@core/lib/rules/predicate/crew';
import { KeywordPredicate } from '@core/lib/rules/predicate/keywords';
import { AndPredicate } from '@core/lib/rules/predicate/and';
import { OrPredicate } from '@core/lib/rules/predicate/or';
import { VoteCountPredicate } from '@core/lib/rules/predicate/voteCount';
import { AgePredicate } from '@core/lib/rules/predicate/age';
import * as movieJson from './movie.json';
import { MovieDetails } from '@core/api/overseerr/interfaces';
import { AdultPredicate } from '@core/lib/rules/predicate/adult';
import { RuntimePredicate } from '@core/lib/rules/predicate/runtime';
import { OriginalLanguagePredicate } from '@core/lib/rules/predicate/originalLanguage';
import { StatusPredicate } from '@core/lib/rules/predicate/status';
import { fromHumanReadableDuration } from '@core/lib/rules/predicate/time';
import { ProductionCompanyPredicate } from '@core/lib/rules/predicate/productionCompany';
import { NotPredicate } from '@core/lib/rules/predicate/not';
import { ReleasedPredicate } from '@core/lib/rules/predicate/released';
import { WatchprovidersPredicate } from '@core/lib/rules/predicate/watchproviders';

const movie = movieJson as MovieDetails;
const testRule = (predicate: Predicate | Predicate[]) => new Rule('test rule', Array.isArray(predicate) ? predicate : [predicate], 'accept');

const assertRuleResult = (rule: Rule, matchExpected: boolean, testMovie: MovieDetails = movie) => {
    const evaluation = rule.matches(testMovie);
    expect(evaluation).toEqual(matchExpected);
};

const assertRuleMatches = (rule: Rule, testMovie: MovieDetails = movie) => {
    assertRuleResult(rule, true, testMovie);
};

const assertRuleDoesntMatch = (rule: Rule, testMovie: MovieDetails = movie) => {
    assertRuleResult(rule, false, testMovie);
};

describe('truePredicate', () => {
    const rule = testRule(new TruePredicate());

    it('should match', async () => {
        assertRuleMatches(rule, movie);
    });
});

describe('falsePredicate', () => {
    const rule = testRule(new FalsePredicate());

    it('should not match', async () => assertRuleDoesntMatch(rule, movie));
});

describe('defaultPredicate', () => {
    it('should match when all children match', async () => {
        const rule = testRule([new TruePredicate(), new TruePredicate()]);
        assertRuleMatches(rule, movie);
    });

    it('should not match when any child does not', async () => {
        const rule = testRule([new TruePredicate(), new FalsePredicate()]);
        assertRuleDoesntMatch(rule, movie);
    });
});

describe('andPredicate', () => {
    it('should match when all children match', async () => {
        const rule = testRule([new AndPredicate([new TruePredicate(), new TruePredicate()])]);
        assertRuleMatches(rule, movie);
    });

    it('should not match when any child does not', async () => {
        const rule = testRule([new AndPredicate([new TruePredicate(), new FalsePredicate()])]);
        assertRuleDoesntMatch(rule, movie);
    });
});

describe('orPredicate', () => {
    it('should match when all children match', async () => {
        const rule = testRule([new OrPredicate([new TruePredicate(), new TruePredicate()])]);
        assertRuleMatches(rule, movie);
    });

    it('should match when at least one child matches', async () => {
        const rule = testRule([new OrPredicate([new TruePredicate(), new FalsePredicate()])]);
        assertRuleMatches(rule, movie);
    });

    it('should not match when no child matches', async () => {
        const rule = testRule([new OrPredicate([new FalsePredicate(), new FalsePredicate()])]);
        assertRuleDoesntMatch(rule, movie);
    });

    it('should not match when vote count below 8554 or above 8556', async () => {
        {
            const rule = testRule(new VoteCountPredicate({ operator: 'lt', threshold: 8554 }));
            assertRuleDoesntMatch(rule, movie);
        }
        {
            const rule = testRule(new VoteCountPredicate({ operator: 'gt', threshold: 8556 }));
            assertRuleDoesntMatch(rule, movie);
        }
    });

    it('should match when vote count above 8555', async () => {
        {
            const rule = testRule(new VoteCountPredicate({ operator: 'gt', threshold: 8554 }));
            assertRuleMatches(rule, movie);
        }
        {
            const rule = testRule(new VoteCountPredicate({ operator: 'lt', threshold: 8556 }));
            assertRuleMatches(rule, movie);
        }
    });

    it('should match genres', async () => {
        {
            const rule = testRule(new GenrePredicate({ terms: ['science-fiction'] }));
            assertRuleMatches(rule, movie);
        }
        {
            const rule = new Rule(
                'simple',
                [
                    new GenrePredicate({
                        terms: ['science-fiction', 'comédie'],
                    }),
                ],
                'accept'
            );
            assertRuleMatches(rule, movie);
        }
        {
            const rule = testRule(new GenrePredicate({ terms: ['comédie'] }));
            assertRuleDoesntMatch(rule, movie);
        }
    });
});

describe('agePredicate', () => {
    it('should match', async () => {
        const rule = testRule(new AgePredicate(fromHumanReadableDuration('more than 1 year')));
        assertRuleMatches(rule, movie);
    });
});
describe('castPredicate', () => {
    it('should match', async () => {
        const rule = testRule(new CastPredicate({ terms: ['Sigourney Weaver'], excludeVoice: false }));
        assertRuleMatches(rule, movie);
    });

    it('should match despite different case', async () => {
        const rule = testRule(new CastPredicate({ terms: ['SiGoUrnEy weAVEr'], excludeVoice: false }));
        assertRuleMatches(rule, movie);
    });

    it('should match if at least one cast match', async () => {
        const rule = testRule([new CastPredicate({ terms: ['Sigourney Weaver', 'Jessica Alba'], excludeVoice: false })]);
        assertRuleMatches(rule, movie);
    });

    it('should not match', async () => {
        const rule = testRule(new CastPredicate({ terms: ['Jessica Alba'], excludeVoice: false }));
        assertRuleDoesntMatch(rule, movie);
    });

    it('should match with voice field', async () => {
        const ruleIncludeVoice = testRule(
            new CastPredicate({
                terms: ['Bob Sherman'],
                excludeVoice: false,
            })
        );
        const ruleExcludeVoice = testRule(
            new CastPredicate({
                terms: ['Bob Sherman'],
                excludeVoice: true,
            })
        );
        const ruleExcludeVoice2 = testRule(
            new CastPredicate({
                terms: ['Bob Sherman', 'Sigourney Weaver'],
                excludeVoice: true,
            })
        );
        assertRuleMatches(ruleIncludeVoice, movie);
        assertRuleMatches(ruleExcludeVoice2, movie);
        assertRuleDoesntMatch(ruleExcludeVoice, movie);
    });
});

describe('crewPredicate', () => {
    it('should match', async () => {
        const rule = testRule(new CrewPredicate({ terms: ['James Cameron'] }));
        assertRuleMatches(rule, movie);
    });

    it('should match with a job', async () => {
        const rule = testRule(
            new CrewPredicate({
                job: 'director',
                terms: ['James Cameron'],
            })
        );
        assertRuleMatches(rule, movie);
    });

    it('should match despite different case', async () => {
        const rule = testRule(new CrewPredicate({ terms: ['JaMEs CamerOn'] }));

        assertRuleMatches(rule, movie);
    });

    it('should match if at least one crew match', async () => {
        const rule = testRule(
            new CrewPredicate({
                job: 'Art Direction',
                terms: ['Bert Davey', 'Ken Court'],
            })
        );

        assertRuleMatches(rule, movie);
    });

    it('should not match', async () => {
        const rule = testRule(new CrewPredicate({ terms: ['Jessica Alba'] }));
        assertRuleDoesntMatch(rule, movie);
    });

    it('should not match when person found in another job', async () => {
        const rule = testRule(
            new CrewPredicate({
                job: 'director',
                terms: ['Peter Lamont'],
            })
        );

        assertRuleDoesntMatch(rule, movie);
    });
});

describe('keywordPredicate', () => {
    it('should match', async () => {
        const rule = testRule(new KeywordPredicate({ terms: ['space travel'] }));

        assertRuleMatches(rule, movie);
    });

    it('should match despite different case', async () => {
        const rule = testRule(new KeywordPredicate({ terms: ['SpAcE TraVel'] }));

        assertRuleMatches(rule, movie);
    });

    it('should match if at least one cast match', async () => {
        const rule = testRule(
            new KeywordPredicate({
                terms: ['space travel', 'unknown keyword'],
            })
        );
        assertRuleMatches(rule, movie);
    });

    it('should not match', async () => {
        const rule = testRule(new KeywordPredicate({ terms: ['unknown keyword'] }));
        assertRuleDoesntMatch(rule, movie);
    });
});

describe('adult predicate', () => {
    it('should match true/false', async () => {
        const noRule = testRule(new AdultPredicate({ value: false }));
        const yesRule = testRule(new AdultPredicate({ value: true }));

        assertRuleMatches(noRule, movie);
        assertRuleDoesntMatch(yesRule, movie);
    });
});

describe('runtime predicate', () => {
    it('should match', async () => {
        assertRuleMatches(testRule(new RuntimePredicate({ operator: 'lt', threshold: 3 * 60 * 60 })), movie);
        assertRuleMatches(testRule(new RuntimePredicate({ operator: 'gt', threshold: 2 * 60 * 60 })), movie);
    });

    it('should not match', async () => {
        assertRuleDoesntMatch(testRule(new RuntimePredicate({ operator: 'gt', threshold: 3 * 60 * 60 })), movie);
        assertRuleDoesntMatch(testRule(new RuntimePredicate({ operator: 'lt', threshold: 2 * 60 * 60 })), movie);
    });
});

describe('originalLanguage predicate', () => {
    it('should match', async () => {
        assertRuleMatches(testRule(new OriginalLanguagePredicate({ terms: ['en'] })), movie);
        assertRuleMatches(testRule(new OriginalLanguagePredicate({ terms: ['en', 'fr'] })), movie);
    });

    it('should not match', async () => {
        assertRuleDoesntMatch(testRule(new OriginalLanguagePredicate({ terms: ['fr'] })), movie);
        assertRuleDoesntMatch(testRule(new OriginalLanguagePredicate({ terms: ['fr', 'de'] })), movie);
    });
});

describe('status predicate', () => {
    it('should match', async () => {
        assertRuleMatches(testRule(new StatusPredicate({ terms: ['released'] })), movie);
        assertRuleMatches(testRule(new StatusPredicate({ terms: ['released', 'post production'] })), movie);
    });

    it('should not match', async () => {
        assertRuleDoesntMatch(testRule(new StatusPredicate({ terms: ['canceled'] })), movie);
        assertRuleDoesntMatch(testRule(new StatusPredicate({ terms: ['canceled', 'post production'] })), movie);
    });
});

describe('productionCompany predicate', () => {
    it('should match', async () => {
        assertRuleMatches(testRule(new ProductionCompanyPredicate({ terms: ['20th Century Fox'] })), movie);
        assertRuleMatches(testRule(new ProductionCompanyPredicate({ terms: ['20th Century Fox', 'Bobcat studios'] })), movie);
    });

    it('should not match', async () => {
        assertRuleDoesntMatch(testRule(new ProductionCompanyPredicate({ terms: ['Bobcat studios'] })), movie);
        assertRuleDoesntMatch(testRule(new ProductionCompanyPredicate({ terms: ['Bobcat studios', '11th Century Fox'] })), movie);
    });
});

describe('not predicate', () => {
    it('should match', async () => {
        assertRuleMatches(testRule(new NotPredicate([new RuntimePredicate({ operator: 'gt', threshold: 3 * 60 * 60 })])), movie);
        assertRuleMatches(testRule(new NotPredicate([new RuntimePredicate({ operator: 'lt', threshold: 2 * 60 * 60 })])), movie);
        assertRuleMatches(
            testRule(
                new NotPredicate([
                    new RuntimePredicate({ operator: 'lt', threshold: 2 * 60 * 60 }),
                    new ProductionCompanyPredicate({ terms: ['12th Century Fox'] }),
                ])
            ),
            movie
        );
    });

    it('should not match', async () => {
        assertRuleDoesntMatch(testRule(new NotPredicate([new RuntimePredicate({ operator: 'lt', threshold: 3 * 60 * 60 })])), movie);
        assertRuleDoesntMatch(testRule(new NotPredicate([new RuntimePredicate({ operator: 'gt', threshold: 2 * 60 * 60 })])), movie);
        assertRuleDoesntMatch(
            testRule(
                new NotPredicate([
                    new RuntimePredicate({ operator: 'lt', threshold: 2 * 60 * 60 }),
                    new ProductionCompanyPredicate({ terms: ['20th Century Fox'] }),
                ])
            ),
            movie
        );
    });
});

describe('or predicate', () => {
    it('should match', async () => {
        assertRuleMatches(
            testRule(
                new OrPredicate([
                    new StatusPredicate({ terms: ['released'] }),
                    new OriginalLanguagePredicate({ terms: ['en'] }),
                    new CastPredicate({ terms: ['Sigourney Weaver', 'Jessica Alba'], excludeVoice: false }),
                ])
            ),
            movie
        );

        assertRuleMatches(
            testRule(
                new OrPredicate([
                    new StatusPredicate({ terms: ['canceled'] }),
                    new OriginalLanguagePredicate({ terms: ['de'] }),
                    new CastPredicate({ terms: ['Sigourney Weaver', 'Jessica Alba'], excludeVoice: false }),
                ])
            ),
            movie
        );
    });

    it('should not match', async () => {
        assertRuleDoesntMatch(
            testRule(
                new OrPredicate([
                    new StatusPredicate({ terms: ['canceled'] }),
                    new OriginalLanguagePredicate({ terms: ['de'] }),
                    new CastPredicate({ terms: ['Jessica Alba'], excludeVoice: false }),
                ])
            ),
            movie
        );
    });
});

describe('and predicate', () => {
    it('should match', async () => {
        assertRuleMatches(
            testRule(
                new AndPredicate([
                    new StatusPredicate({ terms: ['released'] }),
                    new OriginalLanguagePredicate({ terms: ['en'] }),
                    new CastPredicate({ terms: ['Sigourney Weaver', 'Jessica Alba'], excludeVoice: false }),
                ])
            ),
            movie
        );
    });

    it('should not match', async () => {
        assertRuleDoesntMatch(
            testRule(
                new AndPredicate([
                    new StatusPredicate({ terms: ['canceled'] }), // Movie is not cancelled
                    new OriginalLanguagePredicate({ terms: ['en'] }),
                    new CastPredicate({ terms: ['Sigourney Weaver', 'Jessica Alba'], excludeVoice: false }),
                ])
            ),
            movie
        );
    });
});

describe('released predicate', () => {
    it('should match', async () => {
        assertRuleMatches(testRule(new ReleasedPredicate({ value: true })), movie);
        // assertRuleMatches(testRule(new ReleasedPredicate({ value: true })), { ...movie, status: 'test' });
    });

    it('should not match', async () => {
        assertRuleDoesntMatch(testRule(new ReleasedPredicate({ value: false })), movie);
        // assertRuleDoesntMatch(testRule(new ReleasedPredicate({ value: false })), { ...movie, status: 'test' });
    });
});

describe('watchProviders predicate', () => {
    it('should match', async () => {
        assertRuleMatches(testRule(new WatchprovidersPredicate({ region: 'CA', terms: ['Disney Plus', 'Crave'] })), movie);
    });

    it('should not match', async () => {
        assertRuleDoesntMatch(testRule(new WatchprovidersPredicate({ region: 'CA', terms: ['Platform 1', 'Platform 2'] })), movie);
    });
});
