export interface PlexMediaContainer<T> {
    MediaContainer: T;
}

export interface PlexSectionsResponse {
    Directory: PlexSectionDirectory[];
}

export interface PlexSectionDirectory {
    art: string;
    composite: string;
    // filters: string;
    // refreshing: '0',
    thumb: string;
    key: string;
    type: string;
    title: string;
    // agent: 'tv.plex.agents.music',
    // scanner: 'Plex Music',
    // language: 'en-US',
    uuid: string;
    // updatedAt: '1723454062',
    // createdAt: '1688070309',
    // scannedAt: '1703967043',
    // content: '1',
    // directory: '1',
    // contentChangedAt: '7726555702310039813',
    // hidden: '0',
}

export interface PlexVideosResponse {
    size: string;
    Video: PlexVideo[];
}

export interface PlexVideo {
    ratingKey: string;
    Guid?: PlexGuid[];
    title: string;
    originalTitle: string;
}

export interface PlexGuid {
    id: string;
}
