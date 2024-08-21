import HttpApi from '@core/api/httpApi';
import { getSettings } from '@core/lib/settings';
import logger from '@core/log';
import { Parser } from 'xml2js';
import type { AxiosRequestConfig } from 'axios';
import { PlexSectionDirectory, PlexSectionsResponse, PlexVideo, PlexVideosResponse } from '@core/api/plex/interfaces';
import { isFulfilled, success } from '@core/lib/utils';

class PlexApi extends HttpApi {
    xmlParser;

    constructor() {
        super(
            getSettings().plex?.apiUrl ?? '',
            {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/xml',
                },
            }
        );
        this.xmlParser = new Parser({
            mergeAttrs: true,
            explicitArray: false,
        });
    }

    protected async get<T>(endpoint: string, config?: AxiosRequestConfig, ttl?: number): Promise<T> {
        const result = await super.get(
            endpoint,
            {
                ...config,
                params: {
                    'X-Plex-Token': getSettings().plex?.plexToken ?? '',
                    ...config?.params,
                },
            },
            ttl
        );
        const data = await this.xmlParser.parseStringPromise(result as string);
        return data.MediaContainer ? data.MediaContainer : data;
    }

    public test = async () => {
        try {
            logger.info('Testing Plex connection...');
            await this.get('/');
            logger.info(success(' Plex connection successful'));
        } catch (e) {
            logger.error('Error while testing Plex connection. Verify URL and credentials: ', e);
        }
    };

    public getMovie = async (idMovie: number | string) => {
        return await this.get<PlexVideosResponse>(`/library/metadata/${idMovie}`, {
            params: {
                include_guids: 1,
            },
        });
    };

    public getLibrary = async (names: string): Promise<PlexSectionDirectory | undefined> => {
        const libs = await this.get<PlexSectionsResponse>('/library/sections');
        return libs.Directory.find((d) => names.includes(d.title));
    };

    public getGuid = (provider: string, video: PlexVideo) => {
        if (!video['Guid']) {
            return null;
        }
        const prefix = `${provider}://`;
        const guids = video.Guid ? Array.from(video.Guid) : [];
        const guid = guids.find((g) => g.id.startsWith(prefix));
        if (!guid) {
            return null;
        }
        return guid.id.substring(prefix.length);
    };

    public getFavoritesRecommendationsByLibrary = async (sectionKey: string, score: number) => {
        const favorites = await this.get<PlexVideosResponse>(`/library/sections/${sectionKey}/all`, {
            params: {
                'userRating>': score,
            },
        });
        const moviesResults: Array<PromiseSettledResult<PlexVideosResponse>> = await Promise.allSettled(favorites.Video.map((v) => this.getMovie(v.ratingKey)));
        return moviesResults.filter(isFulfilled).flatMap((r) => r.value.Video);
    };
}

export default PlexApi;
