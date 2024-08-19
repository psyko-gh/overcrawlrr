import {MovieDetails} from "@core/api/overseerr/interfaces";
import {Rule} from "@core/lib/rules";
import {PredicateFactory} from "@core/lib/rules/factory";
import {FalsePredicate, TruePredicate, VoteCountPredicate} from "@core/lib/rules/predicate";
import {GenresPredicate} from "@core/lib/rules/predicate/genres";
import {CastPredicate} from "@core/lib/rules/predicate/cast";
import {CrewPredicate} from "@core/lib/rules/predicate/crew";
import {KeywordPredicate} from "@core/lib/rules/predicate/keywords";
import {AndPredicate} from "@core/lib/rules/predicate/and";
import {OrPredicate} from "@core/lib/rules/predicate/or";

const movie = require('./movie.json') as MovieDetails;

PredicateFactory.init()

describe('truePredicate', () => {
    const rule = new Rule(
        'simple',
        [new TruePredicate()],
        'accept')

    it('should match', async () => {
        const response = rule.matches(movie);
        expect(response).toEqual(true)
    })
})

describe('falsePredicate', () => {
    const rule = new Rule(
        'simple',
        [new FalsePredicate()],
        'accept')

    it('should not match', async () => {
        const response = rule.matches(movie);
        expect(response).toEqual(false)
    })
})

describe('defaultPredicate', () => {
    it('should match when all children match', async () => {
        const rule = new Rule(
            'simple',
            [new TruePredicate(), new TruePredicate()],
            'accept')

        const response = rule.matches(movie);
        expect(response).toEqual(true)
    })

    it('should not match when any child does not', async () => {
        const rule = new Rule(
            'simple',
            [new TruePredicate(), new FalsePredicate()],
            'accept')
        const response = rule.matches(movie);
        expect(response).toEqual(false)
    })
})

describe('andPredicate', () => {
    it('should match when all children match', async () => {
        const rule = new Rule(
            'simple',
            [new AndPredicate([
                new TruePredicate(),
                new TruePredicate()
            ])],
            'accept')

        const response = rule.matches(movie);
        expect(response).toEqual(true)
    })

    it('should not match when any child does not', async () => {
        const rule = new Rule(
            'simple',
            [new AndPredicate([
                new TruePredicate(),
                new FalsePredicate()]
            )],
            'accept')
        const response = rule.matches(movie);
        expect(response).toEqual(false)
    })
})

describe('orPredicate', () => {
    it('should match when all children match', async () => {
        const rule = new Rule(
            'simple',
            [new OrPredicate([
                new TruePredicate(),
                new TruePredicate()
            ])],
            'accept')

        const response = rule.matches(movie);
        expect(response).toEqual(true)
    })

    it('should match when at least one child matches', async () => {
        const rule = new Rule(
            'simple',
            [new OrPredicate([
                new TruePredicate(),
                new FalsePredicate()]
            )],
            'accept')
        const response = rule.matches(movie);
        expect(response).toEqual(true)
    })

    it('should not match when no child matches', async () => {
        const rule = new Rule(
            'simple',
            [new OrPredicate([
                new FalsePredicate(),
                new FalsePredicate()]
            )],
            'accept')
        const response = rule.matches(movie);
        expect(response).toEqual(false)
    })

    it('should not match when vote count below 8554 or above 8556', async () => {
        {
            const rule = new Rule(
                'simple',
                [new VoteCountPredicate({threshold: 8554, operator: 'lt'})],
                'accept')
            const response = rule.matches(movie);
            expect(response).toEqual(false)
        }
        {
            const rule = new Rule(
                'simple',
                [new VoteCountPredicate({threshold: 8556, operator: 'gt'})],
                'accept')
            const response = rule.matches(movie);
            expect(response).toEqual(false)
        }
    })

    it('should match when vote count above 8555', async () => {
        {
            const rule = new Rule(
                'simple',
                [new VoteCountPredicate({threshold: 8554, operator: 'gt'})],
                'accept')
            const response = rule.matches(movie);
            expect(response).toEqual(true)
        }
        {
            const rule = new Rule(
                'simple',
                [new VoteCountPredicate({threshold: 8556, operator: 'lt'})],
                'accept')
            const response = rule.matches(movie);
            expect(response).toEqual(true)
        }
    })

    it('should match genders', async () => {
        {
            const rule = new Rule(
                'simple',
                [new GenresPredicate({terms: ['science-fiction']})],
                'accept')
            const response = rule.matches(movie);
            expect(response).toEqual(true)
        }
        {
            const rule = new Rule(
                'simple',
                [new GenresPredicate({terms: ['comédie']})],
                'accept')
            const response = rule.matches(movie);
            expect(response).toEqual(false)
        }
    })
})

describe('castPredicate', () => {
    it('should match', async () => {
        const rule = new Rule(
            'simple',
            [new CastPredicate({terms: ['Sigourney Weaver']})],
            'accept')

        const response = rule.matches(movie);
        expect(response).toEqual(true)
    })

    it('should match despite different case', async () => {
        const rule = new Rule(
            'simple',
            [new CastPredicate({terms: ['SiGoUrnEy weAVEr']})],
            'accept')

        const response = rule.matches(movie);
        expect(response).toEqual(true)
    })

    it('should match if at least one cast match', async () => {
        const rule = new Rule(
            'simple',
            [new CastPredicate({terms: ['Sigourney Weaver', 'Jessica Alba']})],
            'accept')

        const response = rule.matches(movie);
        expect(response).toEqual(true)
    })

    it('should not match', async () => {
        const rule = new Rule(
            'simple',
            [new CastPredicate({terms: ['Jessica Alba']})],
            'accept')

        const response = rule.matches(movie);
        expect(response).toEqual(false)
    })
})


describe('crewPredicate', () => {
    it('should match', async () => {
        const rule = new Rule(
            'simple',
            [new CrewPredicate({terms: ['James Cameron']})],
            'accept')

        const response = rule.matches(movie);
        expect(response).toEqual(true)
    })

    it('should match with a job', async () => {
        const rule = new Rule(
            'simple',
            [new CrewPredicate({job: 'director', terms: ['James Cameron']})],
            'accept')

        const response = rule.matches(movie);
        expect(response).toEqual(true)
    })

    it('should match despite different case', async () => {
        const rule = new Rule(
            'simple',
            [new CrewPredicate({terms: ['JaMEs CamerOn']})],
            'accept')

        const response = rule.matches(movie);
        expect(response).toEqual(true)
    })

    it('should match if at least one cast match', async () => {
        const rule = new Rule(
            'simple',
            [new CrewPredicate({job: 'Art Direction', terms: ['Bert Davey', 'Ken Court']})],
            'accept')

        const response = rule.matches(movie);
        expect(response).toEqual(true)
    })

    it('should not match', async () => {
        const rule = new Rule(
            'simple',
            [new CrewPredicate({terms: ['Jessica Alba']})],
            'accept')

        const response = rule.matches(movie);
        expect(response).toEqual(false)
    })

    it('should not match when person found in another job', async () => {
        const rule = new Rule(
            'simple',
            [new CrewPredicate({job: 'director', terms: ['Peter Lamont']})],
            'accept')

        const response = rule.matches(movie);
        expect(response).toEqual(false)
    })
})

describe('keywordPredicate', () => {
    it('should match', async () => {
        const rule = new Rule(
            'simple',
            [new KeywordPredicate({terms: ['space travel']})],
            'accept')

        const response = rule.matches(movie);
        expect(response).toEqual(true)
    })

    it('should match despite different case', async () => {
        const rule = new Rule(
            'simple',
            [new KeywordPredicate({terms: ['SpAcE TraVel']})],
            'accept')

        const response = rule.matches(movie);
        expect(response).toEqual(true)
    })

    it('should match if at least one cast match', async () => {
        const rule = new Rule(
            'simple',
            [new KeywordPredicate({terms: ['space travel', 'unknown keyword']})],
            'accept')

        const response = rule.matches(movie);
        expect(response).toEqual(true)
    })

    it('should not match', async () => {
        const rule = new Rule(
            'simple',
            [new KeywordPredicate({terms: ['unknown keyword']})],
            'accept')

        const response = rule.matches(movie);
        expect(response).toEqual(false)
    })
})