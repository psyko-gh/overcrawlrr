import {MovieDetails} from "@core/api/overseerr/interfaces";
import {PredicateBuilder} from "@core/lib/rules";
import TagsPredicate from "@core/lib/rules/predicate/tag";
import {ProductionCompanyOptions} from "@core/lib/rules/interfaces";

export class ProductionCompanyPredicate extends TagsPredicate {

    constructor(options: ProductionCompanyOptions) {
        super({terms: Array.isArray(options.productionCompany) ? options.productionCompany : [options.productionCompany]});
    }

    getTags(movie: MovieDetails): string[] {
        if (!movie.productionCompanies) {
            return []
        }
        const tags: string[] = [];
        for (const company of movie.productionCompanies) {
            tags.push(company.name);
        }
        return tags;
    }

}

export const ProductionCompanyPredicateBuilder:PredicateBuilder = {
    key: 'productionCompany',
    build: (data: ProductionCompanyOptions) => new ProductionCompanyPredicate(data)
}