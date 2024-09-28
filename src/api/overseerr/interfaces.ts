export type MediaType = 'tv' | 'movie' | 'person' | 'collection';

export interface AuthResponse {
    id: number;
    permissions: number;
    password: string;
    requestCount: number;
    displayName: string;
}
/* exported MediaStatus */
export enum MediaStatus {
    UNKNOWN = 1,
    PENDING,
    PROCESSING,
    PARTIALLY_AVAILABLE,
    AVAILABLE,
}

interface SearchResult {
    id: number;
    mediaType: MediaType;
    popularity: number;
    posterPath?: string;
    backdropPath?: string;
    voteCount: number;
    voteAverage: number;
    genreIds: number[];
    overview: string;
    originalLanguage: string;
    mediaInfo?: Media;
}

export interface Media {
    id: number;
    mediaType: MediaType;
    tmdbId?: number | null;
    tvdbId?: number | null;
    imdbId?: string | null;
    status: MediaStatus;
    createdAt: string;
    requests?: MediaRequest[];
}

export interface OverseerrResult<T> {
    page: number;
    totalResults: number;
    totalPages: number;
    results: T[];
}

export interface MovieResult extends SearchResult {
    mediaType: 'movie';
    title: string;
    originalTitle: string;
    releaseDate: string;
    adult: boolean;
    video: boolean;
    mediaInfo?: Media;
}

export interface MovieDetails {
    id: number;
    imdbId?: string;
    adult: boolean;
    // backdropPath?: string;
    // posterPath?: string;
    budget: number;
    genres: Genre[];
    homepage?: string;
    originalLanguage: string;
    originalTitle: string;
    overview?: string;
    popularity: number;
    productionCompanies: ProductionCompany[];
    productionCountries: {
        iso_3166_1: string;
        name: string;
    }[];
    releaseDate: string;
    // release_dates: TmdbMovieReleaseResult;
    revenue: number;
    runtime?: number;
    spokenLanguages: {
        english_name: string;
        iso_639_1: string;
        name: string;
    }[];
    status: string;
    tagline?: string;
    title: string;
    video: boolean;
    voteAverage: number;
    voteCount: number;
    credits: {
        cast: CreditCast[];
        crew: CreditCrew[];
    };
    collection?: {
        id: number;
        name: string;
        posterPath?: string;
        backdropPath?: string;
    };
    watchProviders?: WatchProvidersRegion[];
    keywords: {
        id: number;
        name: string;
    }[];
    mediaInfo?: Media;
}

export interface WatchProvidersRegion {
    iso_3166_1: string;
    link?: string;
    buy?: WatchProviderDetails[];
    flatrate?: WatchProviderDetails[];
}

export interface WatchProviderDetails {
    displayPriority?: number;
    logoPath?: string;
    id: number;
    name: string;
}

export interface TmdbKeyword {
    id: number;
    name: string;
}

export enum RequestStatus {
    PENDING = 1,
    APPROVED,
    DECLINED,
}

export interface MediaRequest {
    id: number;
    status: RequestStatus;
    media: Media;
    createdAt: string;
    updatedAt: string;
    is4k: boolean;
    serverId: number;
    profileId: number;
    rootFolder: string;
}

export interface OverseerrRequestsResult {
    page: number;
    totalResults: number;
    totalPages: number;
    results: MediaRequest[];
}

export interface CreditCast {
    id: number;
    castId: number;
    character: string;
    creditId: string;
    gender: number;
    name: string;
    order: number;
}

export interface CreditCrew {
    id: number;
    gender: number;
    name: string;
    job: string;
    department: string;
}

export interface ProductionCompany {
    id: number;
    logoPath: string;
    originCountry: string;
    name: string;
}

export interface Genre {
    id: number;
    name: string;
}

export interface RadarrService {
    id: number;
    name: string;
    is4k: boolean;
    isDefault: boolean;
}

export interface RadarrServiceDetails {
    server: RadarrService;
    profiles: RadarrProfile[];
}

export interface RequestOption {
    server: string;
    profile: string;
    is4k: boolean;
}

export interface RadarrProfile {
    id: number;
    name: string;
}
