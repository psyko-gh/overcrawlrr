import HttpApi from '@core/api/httpApi';
import { getSettings } from '@core/lib/settings';
import logger from '@core/log';
import {
    AuthResponse,
    MediaRequest,
    MovieDetails,
    MovieResult,
    OverseerrRequestsResult,
    OverseerrResult,
    RadarrProfile,
    RadarrService,
    RadarrServiceDetails,
    RequestOption,
} from '@core/api/overseerr/interfaces';
import { getErrorMessage, isFulfilled, success } from '@core/lib/utils';
import NodeCache from 'node-cache';

class OverseerrApi extends HttpApi {
    private overseerrUser?: string;
    private overseerrPassword?: string;
    private radarrCache?: NodeCache;

    constructor() {
        super(getSettings().overseerr.apiUrl, {});
        this.overseerrUser = getSettings().overseerrUser;
        this.overseerrPassword = getSettings().overseerrPassword;
    }

    public test = async () => {
        try {
            logger.info('Testing overseerr connection using:');
            logger.info(`  - url: ${this.baseUrl}`);
            logger.info(`  - user: ${this.overseerrUser}`);
            await this.auth();
            logger.info(success(' Overseerr connection successful'));
        } catch (e: unknown) {
            logger.error(`Error while testing Overseerr connection. Verify URL and credentials: ${getErrorMessage(e)}`);
        }
    };

    public auth = async () => {
        if (!this.overseerrUser) {
            throw new Error('Overseerr user is not set. You can define it as environment variable or in your settings.yaml file.');
        }
        if (!this.overseerrPassword) {
            throw new Error('Overseerr password is not set. You can define it as environment variable or in your settings.yaml file.');
        }
        if (!this.overseerrUser || !this.overseerrPassword) {
            throw new Error('Missing Overseer user or password. Please check your configuration.');
        }
        return await this.post<AuthResponse>(`/auth/local`, {
            email: this.overseerrUser,
            password: this.overseerrPassword,
        });
    };

    public getRequests = async (): Promise<MediaRequest[]> => {
        return (
            await this.get<OverseerrRequestsResult>(
                `/request`,
                {
                    params: {
                        take: 100,
                    },
                },
                1
            )
        ).results;
    };

    public getUpcoming = async (): Promise<MovieResult[]> => {
        return (await this.get<OverseerrResult<MovieResult>>(`/discover/movies/upcoming`, {}, 1)).results;
    };

    public getMovie = async (idMovie: number): Promise<MovieDetails> => {
        return await this.get<MovieDetails>(`/movie/${idMovie}`);
    };

    public getPopular = async (): Promise<MovieResult[]> => {
        return (await this.get<OverseerrResult<MovieResult>>(`/discover/movies`)).results;
    };

    public getTrending = async (): Promise<MovieResult[]> => {
        return (await this.get<OverseerrResult<MovieResult>>(`/discover/trending`)).results;
    };

    public getRecommendationsByMovie = async (idMovie: string | number): Promise<MovieResult[]> => {
        return (await this.get<OverseerrResult<MovieResult>>(`/movie/${idMovie}/recommendations`)).results;
    };

    public requestMovie = async (idMovie: number, options: Partial<RequestOption> = {}) => {
        try {
            const request = {
                mediaType: 'movie',
                mediaId: idMovie,
            } as Partial<MediaRequest>;

            if (options.server) {
                const radarrServer = await this.getRadarr(options.server);
                request.serverId = radarrServer.server.id;
            }

            if (options.profile) {
                const radarrProfile = await this.getRadarrProfile(options.server ?? `default${options.is4k ? '4k' : ''}`, options.profile);
                request.profileId = radarrProfile.id;
            }
            return await this.post(`/request`, request);
        } catch (e) {
            logger.error(e);
        }
    };

    private getRadarrCache = async (): Promise<NodeCache> => {
        if (!this.radarrCache) {
            this.radarrCache = new NodeCache();
            logger.info('Fetching list of Radarr services...');
            const servers = await this.get<Array<RadarrService>>(`/service/radarr`);

            const registerServer = (service: RadarrServiceDetails) => {
                this.radarrCache!.set(`server:${service.server.name}`, service);
                if (service.server.isDefault) {
                    if (service.server.is4k) {
                        this.radarrCache!.set(`server:default4k`, service);
                    } else {
                        this.radarrCache!.set(`server:default`, service);
                    }
                }
                logger.info(`Found Radarr server ${service.server.name} with profiles ${service.profiles.map((s) => s.name).join(', ')}`);
            };
            const services: Array<PromiseSettledResult<RadarrServiceDetails>> = await Promise.allSettled(
                servers.map((s) => this.get<RadarrServiceDetails>(`/service/radarr/${s.id}`))
            );
            services
                .filter(isFulfilled)
                .map((r) => r.value)
                .forEach(registerServer);
        }
        return this.radarrCache;
    };

    public getRadarr = async (serverName: string): Promise<RadarrServiceDetails> => {
        const cache = await this.getRadarrCache();
        const fromCache = cache.get<RadarrServiceDetails>(`server:${serverName}`);
        if (fromCache) {
            return fromCache;
        }
        throw new Error(`Radarr server ${serverName} not found. Check the spelling, and make sure it exists in Overseerr.`);
    };

    public getRadarrProfile = async (serverName: string, profileName: string): Promise<RadarrProfile> => {
        const radarr = await this.getRadarr(serverName);
        const profile = radarr.profiles.find((p) => p.name === profileName);
        if (profile) {
            return profile;
        }
        throw new Error(`Radarr profile ${profileName} not found for server ${serverName}`);
    };
}

export default OverseerrApi;
