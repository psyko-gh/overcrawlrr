import { MovieDetails } from '@core/api/overseerr/interfaces';
import { PredicateBuilder } from '@core/lib/rules';
import { WatchProvidersOptions } from '@core/lib/rules/interfaces';
import { TagsPredicate, TagsPredicateParameters } from '@core/lib/rules/predicate/tag';

export type WatchProvidersPredicateParameters = TagsPredicateParameters & {
    region: string;
};

export class WatchprovidersPredicate extends TagsPredicate {
    private region: string;

    constructor(options: WatchProvidersPredicateParameters) {
        super(options);
        this.region = options.region;
    }

    getTags(movie: MovieDetails): string[] {
        if (!movie.watchProviders) {
            return [];
        }
        const tags: string[] = [];
        for (const region of movie.watchProviders) {
            if (region.iso_3166_1.toLowerCase() === this.region.toLowerCase()) {
                if (region.flatrate) {
                    tags.push(...region.flatrate.map((r) => r.name));
                }
            }
        }
        return tags;
    }
}

export const WatchProvidersPredicateBuilder: PredicateBuilder = {
    key: 'watchProviders',
    build: (data: WatchProvidersOptions) => {
        const parameters = {
            terms: data.watchProviders.names,
            region: data.watchProviders.region ?? '',
        };
        return new WatchprovidersPredicate(parameters);
    },
};
