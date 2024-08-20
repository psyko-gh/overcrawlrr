import {Predicate} from "@core/lib/rules";
import {MovieDetails} from "@core/api/overseerr/interfaces";

export class TruePredicate extends Predicate {
    matches(_movie: MovieDetails): boolean {
        return true;
    }
}

export class FalsePredicate extends Predicate {
    matches(_movie: MovieDetails): boolean {
        return false;
    }
}
