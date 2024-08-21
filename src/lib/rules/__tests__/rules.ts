import { Rule } from '@core/lib/rules';
import { FalsePredicate, TruePredicate } from '@core/lib/rules/predicate';
import { GenresPredicate } from '@core/lib/rules/predicate/genres';
import { CastPredicate } from '@core/lib/rules/predicate/cast';
import { CrewPredicate } from '@core/lib/rules/predicate/crew';
import { KeywordPredicate } from '@core/lib/rules/predicate/keywords';
import { AndPredicate } from '@core/lib/rules/predicate/and';
import { OrPredicate } from '@core/lib/rules/predicate/or';
import fs from 'fs';
import { VoteCountPredicate } from '@core/lib/rules/predicate/voteCount';
import { AgePredicate } from '@core/lib/rules/predicate/age';
import { PredicateFactory } from '@core/lib/rules/factory';

const movie = JSON.parse(fs.readFileSync('./movie.json', 'utf8'));

PredicateFactory.init();

describe('truePredicate', () => {
    const rule = new Rule('simple', [new TruePredicate()], 'accept');

    it('should match', async () => {
        const response = rule.matches(movie);
        expect(response).toEqual(true);
    });
});

describe('falsePredicate', () => {
    const rule = new Rule('simple', [new FalsePredicate()], 'accept');

    it('should not match', async () => {
        const response = rule.matches(movie);
        expect(response).toEqual(false);
    });
});

describe('defaultPredicate', () => {
    it('should match when all children match', async () => {
        const rule = new Rule('simple', [new TruePredicate(), new TruePredicate()], 'accept');

        const response = rule.matches(movie);
        expect(response).toEqual(true);
    });

    it('should not match when any child does not', async () => {
        const rule = new Rule('simple', [new TruePredicate(), new FalsePredicate()], 'accept');
        const response = rule.matches(movie);
        expect(response).toEqual(false);
    });
});

describe('andPredicate', () => {
    it('should match when all children match', async () => {
        const rule = new Rule('simple', [new AndPredicate([new TruePredicate(), new TruePredicate()])], 'accept');

        const response = rule.matches(movie);
        expect(response).toEqual(true);
    });

    it('should not match when any child does not', async () => {
        const rule = new Rule('simple', [new AndPredicate([new TruePredicate(), new FalsePredicate()])], 'accept');
        const response = rule.matches(movie);
        expect(response).toEqual(false);
    });
});

describe('orPredicate', () => {
    it('should match when all children match', async () => {
        const rule = new Rule('simple', [new OrPredicate([new TruePredicate(), new TruePredicate()])], 'accept');

        const response = rule.matches(movie);
        expect(response).toEqual(true);
    });

    it('should match when at least one child matches', async () => {
        const rule = new Rule('simple', [new OrPredicate([new TruePredicate(), new FalsePredicate()])], 'accept');
        const response = rule.matches(movie);
        expect(response).toEqual(true);
    });

    it('should not match when no child matches', async () => {
        const rule = new Rule('simple', [new OrPredicate([new FalsePredicate(), new FalsePredicate()])], 'accept');
        const response = rule.matches(movie);
        expect(response).toEqual(false);
    });

    it('should not match when vote count below 8554 or above 8556', async () => {
        {
            const rule = new Rule('simple', [new VoteCountPredicate({ voteCount: 'less than 8554' })], 'accept');
            const response = rule.matches(movie);
            expect(response).toEqual(false);
        }
        {
            const rule = new Rule('simple', [new VoteCountPredicate({ voteCount: 'above 8556' })], 'accept');
            const response = rule.matches(movie);
            expect(response).toEqual(false);
        }
    });

    it('should match when vote count above 8555', async () => {
        {
            const rule = new Rule('simple', [new VoteCountPredicate({ voteCount: 'above 8554' })], 'accept');
            const response = rule.matches(movie);
            expect(response).toEqual(true);
        }
        {
            const rule = new Rule('simple', [new VoteCountPredicate({ voteCount: 'less than 8556' })], 'accept');
            const response = rule.matches(movie);
            expect(response).toEqual(true);
        }
    });

    it('should match genres', async () => {
        {
            const rule = new Rule('simple', [new GenresPredicate({ genre: 'science-fiction' })], 'accept');
            const response = rule.matches(movie);
            expect(response).toEqual(true);
        }
        {
            const rule = new Rule(
                'simple',
                [
                    new GenresPredicate({
                        genre: ['science-fiction', 'comédie'],
                    }),
                ],
                'accept'
            );
            const response = rule.matches(movie);
            expect(response).toEqual(true);
        }
        {
            const rule = new Rule('simple', [new GenresPredicate({ genre: 'comédie' })], 'accept');
            const response = rule.matches(movie);
            expect(response).toEqual(false);
        }
    });
});

describe('agePredicate', () => {
    it('should match', async () => {
        const rule = new Rule('simple', [new AgePredicate({ age: 'more than 1 year' })], 'accept');

        const response = rule.matches(movie);
        expect(response).toEqual(true);
    });
});
describe('castPredicate', () => {
    it('should match', async () => {
        const rule = new Rule('simple', [new CastPredicate({ cast: ['Sigourney Weaver'] })], 'accept');

        const response = rule.matches(movie);
        expect(response).toEqual(true);
    });

    it('should match despite different case', async () => {
        const rule = new Rule('simple', [new CastPredicate({ cast: ['SiGoUrnEy weAVEr'] })], 'accept');

        const response = rule.matches(movie);
        expect(response).toEqual(true);
    });

    it('should match if at least one cast match', async () => {
        const rule = new Rule('simple', [new CastPredicate({ cast: ['Sigourney Weaver', 'Jessica Alba'] })], 'accept');

        const response = rule.matches(movie);
        expect(response).toEqual(true);
    });

    it('should not match', async () => {
        const rule = new Rule('simple', [new CastPredicate({ cast: ['Jessica Alba'] })], 'accept');

        const response = rule.matches(movie);
        expect(response).toEqual(false);
    });
});

describe('crewPredicate', () => {
    it('should match', async () => {
        const rule = new Rule('simple', [new CrewPredicate({ crew: ['James Cameron'] })], 'accept');

        const response = rule.matches(movie);
        expect(response).toEqual(true);
    });

    it('should match with a job', async () => {
        const rule = new Rule(
            'simple',
            [
                new CrewPredicate({
                    crew: { job: 'director', names: ['James Cameron'] },
                }),
            ],
            'accept'
        );

        const response = rule.matches(movie);
        expect(response).toEqual(true);
    });

    it('should match despite different case', async () => {
        const rule = new Rule('simple', [new CrewPredicate({ crew: ['JaMEs CamerOn'] })], 'accept');

        const response = rule.matches(movie);
        expect(response).toEqual(true);
    });

    it('should match if at least one crew match', async () => {
        const rule = new Rule(
            'simple',
            [
                new CrewPredicate({
                    crew: {
                        job: 'Art Direction',
                        names: ['Bert Davey', 'Ken Court'],
                    },
                }),
            ],
            'accept'
        );

        const response = rule.matches(movie);
        expect(response).toEqual(true);
    });

    it('should not match', async () => {
        const rule = new Rule('simple', [new CrewPredicate({ crew: ['Jessica Alba'] })], 'accept');

        const response = rule.matches(movie);
        expect(response).toEqual(false);
    });

    it('should not match when person found in another job', async () => {
        const rule = new Rule(
            'simple',
            [
                new CrewPredicate({
                    crew: { job: 'director', names: ['Peter Lamont'] },
                }),
            ],
            'accept'
        );

        const response = rule.matches(movie);
        expect(response).toEqual(false);
    });
});

describe('keywordPredicate', () => {
    it('should match string', async () => {
        const rule = new Rule('simple', [new KeywordPredicate({ keyword: 'space travel' })], 'accept');

        const response = rule.matches(movie);
        expect(response).toEqual(true);
    });

    it('should match array', async () => {
        const rule = new Rule('simple', [new KeywordPredicate({ keyword: ['space travel'] })], 'accept');

        const response = rule.matches(movie);
        expect(response).toEqual(true);
    });

    it('should match despite different case', async () => {
        const rule = new Rule('simple', [new KeywordPredicate({ keyword: ['SpAcE TraVel'] })], 'accept');

        const response = rule.matches(movie);
        expect(response).toEqual(true);
    });

    it('should match if at least one cast match', async () => {
        const rule = new Rule(
            'simple',
            [
                new KeywordPredicate({
                    keyword: ['space travel', 'unknown keyword'],
                }),
            ],
            'accept'
        );

        const response = rule.matches(movie);
        expect(response).toEqual(true);
    });

    it('should not match', async () => {
        const rule = new Rule('simple', [new KeywordPredicate({ keyword: ['unknown keyword'] })], 'accept');

        const response = rule.matches(movie);
        expect(response).toEqual(false);
    });
});
