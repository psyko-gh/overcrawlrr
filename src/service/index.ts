import logger from '@core/log';
import { getSettings } from '@core/lib/settings';
import OverseerrApi from '@core/api/overseerr';
import { MediaStatus, MovieResult, RequestOption } from '@core/api/overseerr/interfaces';
import Ruleset, { getRuleset } from '@core/lib/ruleset';
import { color, distinctMovies, isFulfilled, isMovie, success } from '@core/lib/utils';
import PlexApi from '@core/api/plex';

const processMovieResult = async (movies: MovieResult[], overseerr: OverseerrApi, ruleset: Ruleset, dryRun: boolean) => {
    for (const movie of movies) {
        if (movie.mediaInfo && movie.mediaInfo.status !== MediaStatus.UNKNOWN) {
            logger.info(`  Skipping  - "${movie.title}" because it has already been processed`);
            continue;
        }
        try {
            const movieDetails = await overseerr.getMovie(movie.id);
            if (movieDetails.mediaInfo?.requests) {
                logger.info(`  Skipping  - "${movie.title}" because it already has requests`);
                continue;
            }
            const ruleResult = ruleset.evaluateRules(movieDetails);

            if (ruleResult.result === 'accept') {
                logger.info(success(` Adding - "${ruleResult.movie.title}" because it matches rule "${color.green(ruleResult.rule?.name ?? '')}"`));
                if (dryRun) {
                    logger.info(`Dry run - A request would have been sent to Overseerr to request movie ${movie.title}`);
                } else {
                    const options = {
                        ...(ruleResult.rule?.with?.radarr ?? {}),
                    } as RequestOption;

                    await overseerr.requestMovie(movie.id, options);
                }
            } else if (ruleResult.result === 'reject') {
                logger.info(`${color.red('  Rejecting')} - "${ruleResult.movie.title}" because of rule "${color.blue(ruleResult.rule?.name ?? '')}"`);
            } else {
                logger.info(`  Skipping  - "${ruleResult.movie.title}" doesn't match any rule`);
            }
        } catch (e) {
            logger.error(`Error while analyzing movie ${movie.id} - ${movie.title}`, e);
        }
    }
};

export const discover = async () => {
    logger.info('Starting discovery...');
    try {
        const overseerr = new OverseerrApi();
        await overseerr.auth();

        const settings = getSettings().discovery;
        const streams = settings.streams ?? ['upcoming', 'popular'];
        if (!settings.ruleset) {
            throw new Error(`No ruleset defined in Discovery section`);
        }
        const ruleset = getRuleset(settings.ruleset);
        logger.info(`Using ruleset: ${ruleset.name}`);

        logger.info(` Searching into following streams: ${streams.join(', ')}`);
        const results: Promise<MovieResult[]>[] = streams.map((s) => {
            if (s.toLowerCase() == 'upcoming') {
                return overseerr.getUpcoming();
            } else if (s.toLowerCase() == 'trending') {
                return overseerr.getTrending();
            } else {
                return overseerr.getPopular();
            }
        });

        const promiseResults = await Promise.allSettled(results);
        const movies = promiseResults
            .filter(isFulfilled)
            .flatMap((p: PromiseFulfilledResult<MovieResult[]>) => p.value)
            .filter(isMovie)
            .reduce(distinctMovies, []);

        logger.info(`Found ${movies.length} to analyze...`);
        const dryRun = getSettings().overseerr.dryRun ?? false;

        await processMovieResult(movies, overseerr, ruleset, dryRun);
    } finally {
        logger.info('Discovery complete !');
    }
};

export const smartRecommendations = async () => {
    logger.info('Starting smart recommendations...');
    try {
        const overseerr = new OverseerrApi();
        await overseerr.auth();
        const plex = new PlexApi();

        const settings = getSettings().smartRecommendations;
        if (!settings) {
            logger.info(`Missing configuration. Stopping...`);
            return;
        }
        if (!settings.ruleset) {
            logger.info(`No ruleset defined in Favorites Recommendations section`);
            return;
        }
        const ruleset = getRuleset(settings.ruleset);
        logger.info(`Using ruleset: ${ruleset.name}`);
        const library = await plex.getLibrary(settings.plexLibrary);
        if (!library) {
            logger.info(`Cannot find Plex library '${settings.plexLibrary}'. Stopping...`);
            return;
        }
        const movies = await plex.getFavoritesRecommendationsByLibrary(library.key, settings.minimumRating);
        const moviesGuids = new Set<string>();
        movies
            .map((v) => plex.getGuid('tmdb', v))
            .forEach((g) => {
                if (g) {
                    moviesGuids.add(g);
                }
            });
        const dryRun = getSettings().overseerr.dryRun ?? false;

        const recommendationsResults = await Promise.allSettled(Array.from(moviesGuids).map((guid: string) => overseerr.getRecommendationsByMovie(guid)));
        const recommendations = recommendationsResults.filter(isFulfilled).flatMap((r) => r.value);

        // Remove duplicates
        const recommendationsMap = new Map<number, MovieResult>(recommendations.map((movie) => [movie.id, movie]));
        const recommendedMovies = Array.from(recommendationsMap.values());

        await processMovieResult(recommendedMovies, overseerr, ruleset, dryRun);
    } finally {
        logger.info('Smart recommendations complete !');
    }
};
