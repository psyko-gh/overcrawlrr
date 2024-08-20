import { MovieDetails } from '@core/api/overseerr/interfaces';
import { PredicateBuilder } from '@core/lib/rules';
import TagsPredicate from '@core/lib/rules/predicate/tag';
import { WatchProvidersOptions } from '@core/lib/rules/interfaces';

export class WatchprovidersPredicate extends TagsPredicate {
    private region: string;

    constructor(options: WatchProvidersOptions) {
        super({ terms: options.names });
        this.region = options.region.toLowerCase();
    }

    getTags(movie: MovieDetails): string[] {
        if (!movie.watchProviders) {
            return [];
        }
        const tags: string[] = [];
        for (const region of movie.watchProviders) {
            if (region.iso_3166_1.toLowerCase() === this.region) {
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
    build: (data: WatchProvidersOptions) => new WatchprovidersPredicate(data),
};
