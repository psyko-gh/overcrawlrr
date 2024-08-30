import { NumberPredicate } from '@core/lib/rules/predicate/number';
import { MovieDetails } from '@core/api/overseerr/interfaces';
import { PredicateBuilder } from '@core/lib/rules';
import logger from '@core/log';
import { ScoreOptions } from '@core/lib/rules/interfaces';

export class ScorePredicate extends NumberPredicate {
    constructor(options: ScoreOptions) {
        super(fromHumanReadableScore(options.score), (movie: MovieDetails) => movie.voteAverage);
    }
}

export const fromHumanReadableScore = (str: string): { threshold: number; operator: 'lt' | 'gt' } => {
    const regex = /(below|under|less than|above|greater than) ((?:\d+(\.\d+)?|\d+\/\d+)?)$/gm;
    const ratioRegex = /(\d+)\/(\d+)/gm;
    const groups = [...str.matchAll(regex)][0];
    if (!groups) {
        throw new Error(`Unparsable score string '${str}' !`);
    }
    const operator = groups[1];
    const thresholdString = groups[2];
    let threshold = Number(thresholdString);

    const ratioGroups = [...thresholdString.matchAll(ratioRegex)][0];
    if (ratioGroups) {
        const numerator = Number(ratioGroups[1]);
        const denominator = Number(ratioGroups[2]);
        if (numerator > denominator) {
            logger.warn(
                `Invalid expression: ${str}. In score expression, denominator should be greater than numerator. Using numerator value ${numerator} as threshold`
            );
        }
        if (denominator === 0) {
            logger.warn(`In score expression, denominator should not be 0. Using numerator value ${numerator} as threshold`);
            threshold = numerator;
        } else {
            // Bring the value back in the range of 0..10 with 2 decimals
            threshold = Math.floor((numerator / denominator) * 1000) / 100;
        }
    }
    return {
        operator: ['below', 'under', 'less than'].includes(operator) ? 'lt' : 'gt',
        threshold: threshold,
    };
};

export const ScorePredicateBuilder: PredicateBuilder = {
    key: 'score',
    build: (data: ScoreOptions) => new ScorePredicate(data),
};
