import { fromHumanReadableNumber, NumberPredicate, NumberPredicateParameters } from '@core/lib/rules/predicate/number';
import { MovieDetails } from '@core/api/overseerr/interfaces';
import { PredicateBuilder } from '@core/lib/rules';
import { VoteCountOptions } from '@core/lib/rules/interfaces';

export type VoteCountPredicateParameters = NumberPredicateParameters;

export class VoteCountPredicate extends NumberPredicate {
    constructor(options: VoteCountPredicateParameters) {
        super(options);
    }

    protected getMetrics(movie: MovieDetails): number {
        return movie.voteCount;
    }
}

export const VoteCountPredicateBuilder: PredicateBuilder = {
    key: 'voteCount',
    build: (data: VoteCountOptions) => new VoteCountPredicate(fromHumanReadableNumber(data.voteCount)),
};
