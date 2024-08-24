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
            const rule = testRule(new VoteCountPredicate({ voteCount: 'less than 8554' }));
            assertRuleDoesntMatch(rule, movie);
        }
        {
            const rule = testRule(new VoteCountPredicate({ voteCount: 'above 8556' }));
            assertRuleDoesntMatch(rule, movie);
        }
    });

    it('should match when vote count above 8555', async () => {
        {
            const rule = testRule(new VoteCountPredicate({ voteCount: 'above 8554' }));
            assertRuleMatches(rule, movie);
        }
        {
            const rule = testRule(new VoteCountPredicate({ voteCount: 'less than 8556' }));
            assertRuleMatches(rule, movie);
        }
    });

    it('should match genres', async () => {
        {
            const rule = testRule(new GenrePredicate({ genre: 'science-fiction' }));
            assertRuleMatches(rule, movie);
        }
        {
            const rule = new Rule(
                'simple',
                [
                    new GenrePredicate({
                        genre: ['science-fiction', 'comédie'],
                    }),
                ],
                'accept'
            );
            assertRuleMatches(rule, movie);
        }
        {
            const rule = testRule(new GenrePredicate({ genre: 'comédie' }));
            assertRuleDoesntMatch(rule, movie);
        }
    });
});

describe('agePredicate', () => {
    it('should match', async () => {
        const rule = testRule(new AgePredicate({ age: 'more than 1 year' }));
        assertRuleMatches(rule, movie);
    });
});
describe('castPredicate', () => {
    it('should match', async () => {
        const rule = testRule(new CastPredicate({ cast: ['Sigourney Weaver'] }));
        assertRuleMatches(rule, movie);
    });

    it('should match despite different case', async () => {
        const rule = testRule(new CastPredicate({ cast: ['SiGoUrnEy weAVEr'] }));
        assertRuleMatches(rule, movie);
    });

    it('should match if at least one cast match', async () => {
        const rule = testRule([new CastPredicate({ cast: ['Sigourney Weaver', 'Jessica Alba'] })]);
        assertRuleMatches(rule, movie);
    });

    it('should not match', async () => {
        const rule = testRule(new CastPredicate({ cast: ['Jessica Alba'] }));
        assertRuleDoesntMatch(rule, movie);
    });
});

describe('crewPredicate', () => {
    it('should match', async () => {
        const rule = testRule(new CrewPredicate({ crew: ['James Cameron'] }));
        assertRuleMatches(rule, movie);
    });

    it('should match with a job', async () => {
        const rule = testRule(
            new CrewPredicate({
                crew: { job: 'director', names: ['James Cameron'] },
            })
        );
        assertRuleMatches(rule, movie);
    });

    it('should match despite different case', async () => {
        const rule = testRule(new CrewPredicate({ crew: ['JaMEs CamerOn'] }));

        assertRuleMatches(rule, movie);
    });

    it('should match if at least one crew match', async () => {
        const rule = testRule(
            new CrewPredicate({
                crew: {
                    job: 'Art Direction',
                    names: ['Bert Davey', 'Ken Court'],
                },
            })
        );

        assertRuleMatches(rule, movie);
    });

    it('should not match', async () => {
        const rule = testRule(new CrewPredicate({ crew: ['Jessica Alba'] }));
        assertRuleDoesntMatch(rule, movie);
    });

    it('should not match when person found in another job', async () => {
        const rule = testRule(
            new CrewPredicate({
                crew: { job: 'director', names: ['Peter Lamont'] },
            })
        );

        assertRuleDoesntMatch(rule, movie);
    });
});

describe('keywordPredicate', () => {
    it('should match string', async () => {
        const rule = testRule(new KeywordPredicate({ keyword: 'space travel' }));

        assertRuleMatches(rule, movie);
    });

    it('should match array', async () => {
        const rule = testRule(new KeywordPredicate({ keyword: ['space travel'] }));

        assertRuleMatches(rule, movie);
    });

    it('should match despite different case', async () => {
        const rule = testRule(new KeywordPredicate({ keyword: ['SpAcE TraVel'] }));

        assertRuleMatches(rule, movie);
    });

    it('should match if at least one cast match', async () => {
        const rule = testRule(
            new KeywordPredicate({
                keyword: ['space travel', 'unknown keyword'],
            })
        );
        assertRuleMatches(rule, movie);
    });

    it('should not match', async () => {
        const rule = testRule(new KeywordPredicate({ keyword: ['unknown keyword'] }));
        assertRuleDoesntMatch(rule, movie);
    });
});

describe('adult predicate', () => {
    it('should match true/false', async () => {
        const noRule = testRule(new AdultPredicate({ adult: 'false' }));
        const yesRule = testRule(new AdultPredicate({ adult: 'true' }));

        assertRuleMatches(noRule, movie);
        assertRuleDoesntMatch(yesRule, movie);
    });

    it('should match yes/no', async () => {
        const noRule = testRule(new AdultPredicate({ adult: 'no' }));
        const yesRule = testRule(new AdultPredicate({ adult: 'yes' }));

        assertRuleMatches(noRule, movie);
        assertRuleDoesntMatch(yesRule, movie);
    });
});
