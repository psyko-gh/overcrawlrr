import { fromHumanReadableNumber, NumberPredicate } from '@core/lib/rules/predicate/number';
import { MovieDetails } from '@core/api/overseerr/interfaces';
import { PredicateBuilder } from '@core/lib/rules';
import { VoteCountOptions } from '@core/lib/rules/interfaces';

export class VoteCountPredicate extends NumberPredicate {
    constructor(options: VoteCountOptions) {
        super(fromHumanReadableNumber(options.voteCount), (movie: MovieDetails) => movie.voteCount);
    }
}

export const VoteCountPredicateBuilder: PredicateBuilder = {
    key: 'voteCount',
    build: (data: VoteCountOptions) => new VoteCountPredicate(data),
};
