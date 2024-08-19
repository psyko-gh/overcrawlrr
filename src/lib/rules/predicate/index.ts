import {fromHumanReadableDuration} from "@core/lib/rules/predicate/time";
import {Predicate, PredicateBuilder} from "@core/lib/rules";
import {MovieDetails} from "@core/api/overseerr/interfaces";
import {fromHumanReadableNumber, NumberPredicate, NumberPredicateOptions} from "@core/lib/rules/predicate/number";

export class TruePredicate extends Predicate {
    matches(movie: MovieDetails): boolean {
        return true;
    }
}

export class FalsePredicate extends Predicate {
    matches(movie: MovieDetails): boolean {
        return false;
    }
}

export class AgePredicate extends NumberPredicate {
    constructor(options: NumberPredicateOptions) {
        super(options);
    }

    getMeasurement(movie: MovieDetails): number {
        return (Date.now() - Date.parse(movie.releaseDate)) / 1000;
    }
}

export const AgePredicateBuilder:PredicateBuilder = {
    key: 'age',
    build: (data: string) => new AgePredicate(fromHumanReadableDuration(data))
}


export class ScorePredicate extends NumberPredicate {
    constructor(options: NumberPredicateOptions) {
        super(options);
    }

    getMeasurement(movie: MovieDetails): number {
        return movie.voteAverage;
    }
}

export const ScorePredicateBuilder:PredicateBuilder = {
    key: 'score',
    build: (data: string) => new ScorePredicate(fromHumanReadableNumber(data))
}

export class VoteCountPredicate extends NumberPredicate {
    constructor(options: NumberPredicateOptions) {
        super(options);
    }

    getMeasurement(movie: MovieDetails): number {
        return movie.voteCount;
    }
}

export const VoteCountPredicateBuilder:PredicateBuilder = {
    key: 'voteCount',
    build: (data: string) => new VoteCountPredicate(fromHumanReadableNumber(data))
}