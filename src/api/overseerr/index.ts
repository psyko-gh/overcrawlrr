import HttpApi from "@core/api/httpApi";
import {getSettings} from "@core/lib/settings";
import logger from "@core/log";
import {
    AuthResponse, MediaRequest,
    MovieDetails,
    MovieResult,
    OverseerrRequestsResult,
    OverseerrResult
} from "@core/api/overseerr/interfaces";
import {color, Icon} from "@core/lib/utils";

class OverseerrApi extends HttpApi {

    constructor() {
        super(
            getSettings().overseerr.apiUrl,
            {});
    }

    public test = async () => {
        try {
            logger.info('Testing overseerr connection...');
            await this.auth();
            logger.info(color.green(Icon.CHECK) + ' Overseerr connection successful');
        } catch (e) {
            logger.error('Error while testing Overseerr connection. Verify URL and credentials: ', e);
        }
    }

    public auth = async () => {
        const settings = getSettings().load().overseerr;
        return await this.post<AuthResponse>(`/auth/local`, {
            email: settings.user,
            password: settings.password
        });
    }

    public getRequests = async (): Promise<MediaRequest[]> => {
        return (await this.get<OverseerrRequestsResult>(`/request`,
            {
                    params: {
                        take: 100
                    }
                },
            1)).results
    }

    public getUpcoming = async (): Promise<MovieResult[]> => {
        return (await this.get<OverseerrResult<MovieResult>>(`/discover/movies/upcoming`, {}, 1)).results
    }

    public getMovie = async (idMovie: number): Promise<MovieDetails> => {
        return await this.get<MovieDetails>(`/movie/${idMovie}`)
    }

    public getPopular = async (): Promise<MovieResult[]> => {
        return (await this.get<OverseerrResult<MovieResult>>(`/discover/movies`)).results
    }

    public getTrending = async (): Promise<MovieResult[]> => {
        return (await this.get<OverseerrResult<MovieResult>>(`/discover/trending`)).results
    }

    public getRecommendationsByMovie = async (idMovie: string | number): Promise<MovieResult[]> => {
        return (await this.get<OverseerrResult<MovieResult>>(`/movie/${idMovie}/recommendations`)).results
    }

    public requestMovie = async (idMovie: number) => {
        try {
            return await this.post(`/request`, {
               mediaType: 'movie',
               mediaId: idMovie
            })
        } catch (e) {
            logger.error(e);
        }
    }
}

export default OverseerrApi;