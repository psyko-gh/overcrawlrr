import HttpApi from '@core/api/httpApi';
import { getSettings } from '@core/lib/settings';
import logger from '@core/log';
import { AuthResponse, MediaRequest, MovieDetails, MovieResult, OverseerrRequestsResult, OverseerrResult } from '@core/api/overseerr/interfaces';
import { getErrorMessage, success } from '@core/lib/utils';

class OverseerrApi extends HttpApi {
    private overseerrUser?: string;
    private overseerrPassword?: string;

    constructor() {
        super(getSettings().overseerr.apiUrl, {});
        this.overseerrUser = getSettings().overseerrUser;
        this.overseerrPassword = getSettings().overseerrPassword;
    }

    public test = async () => {
        try {
            logger.info('Testing overseerr connection...');
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

    public requestMovie = async (idMovie: number) => {
        try {
            return await this.post(`/request`, {
                mediaType: 'movie',
                mediaId: idMovie,
            });
        } catch (e) {
            logger.error(e);
        }
    };
}

export default OverseerrApi;
