import {MovieDetails} from "@core/api/overseerr/interfaces";
import {PredicateBuilder} from "@core/lib/rules";
import TagsPredicate, {TagsPredicateOptions} from "@core/lib/rules/predicate/tag";

export type ProductionCompanyOptions = {

} & TagsPredicateOptions;

export class ProductionCompanyPredicate extends TagsPredicate {

    constructor(options: ProductionCompanyOptions) {
        super(options);
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
    build: (data: string[]) => {
        if (!Array.isArray(data)) {
            throw new Error('Error while building ProductionCompany filter. Expecting a list of company names...')
        }
        return new ProductionCompanyPredicate({terms: data})
    }
}