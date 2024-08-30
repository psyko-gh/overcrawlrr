import { MovieDetails } from '@core/api/overseerr/interfaces';
import { PredicateBuilder } from '@core/lib/rules';
import { ProductionCompanyOptions } from '@core/lib/rules/interfaces';
import { TagsPredicate, TagsPredicateParameters } from '@core/lib/rules/predicate/tag';

export type ProductionCompanyPredicateParameters = TagsPredicateParameters;

export class ProductionCompanyPredicate extends TagsPredicate {
    constructor(options: ProductionCompanyPredicateParameters) {
        super(options);
    }

    getTags(movie: MovieDetails): string[] {
        if (!movie.productionCompanies) {
            return [];
        }
        const tags: string[] = [];
        for (const company of movie.productionCompanies) {
            tags.push(company.name);
        }
        return tags;
    }
}

export const ProductionCompanyPredicateBuilder: PredicateBuilder = {
    key: 'productionCompany',
    build: (data: ProductionCompanyOptions) => {
        const parameters = {
            terms: Array.isArray(data.productionCompany) ? data.productionCompany : [data.productionCompany],
        };
        return new ProductionCompanyPredicate(parameters);
    },
};
