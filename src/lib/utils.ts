import { MovieResult } from '@core/api/overseerr/interfaces';

export const isFulfilled = <T extends object>(v: PromiseSettledResult<T>): v is PromiseFulfilledResult<T> =>
    v.status === 'fulfilled';

export const isMovie = (m: MovieResult) => m.mediaType === 'movie';

export const distinctMovies = (acc: MovieResult[], movie: MovieResult) => {
    if (!acc.find((m: MovieResult) => m.id === movie.id)) {
        acc.push(movie);
    }
    return acc;
};

enum EscapeCode {
    FG_BLACK = '\x1b[30m',
    FG_RED = '\x1b[31m',
    FG_GREEN = '\x1b[32m',
    FG_YELLOW = '\x1b[33m',
    FG_BLUE = '\x1b[34m',
    FG_MAGENTA = '\x1b[35m',
    FG_CYAN = '\x1b[36m',
    FG_WHITE = '\x1b[37m',
    RESET = '\x1b[0m',
}

export enum Icon {
    CHECK = '\u2714',
}

const colorize = (color: EscapeCode, str: string): string => color + str + EscapeCode.RESET;

export const color = {
    black: (str: string): string => colorize(EscapeCode.FG_BLACK, str),
    red: (str: string): string => colorize(EscapeCode.FG_RED, str),
    green: (str: string): string => colorize(EscapeCode.FG_GREEN, str),
    yellow: (str: string): string => colorize(EscapeCode.FG_YELLOW, str),
    blue: (str: string): string => colorize(EscapeCode.FG_BLUE, str),
    magenta: (str: string): string => colorize(EscapeCode.FG_MAGENTA, str),
    cyan: (str: string): string => colorize(EscapeCode.FG_CYAN, str),
    white: (str: string): string => colorize(EscapeCode.FG_WHITE, str),
};

type ErrorWithMessage = {
    message: string;
};

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
    return (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof (error as Record<string, unknown>).message === 'string'
    );
}

function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
    if (isErrorWithMessage(maybeError)) return maybeError;

    try {
        return new Error(JSON.stringify(maybeError));
    } catch {
        // fallback in case there's an error stringifying the maybeError
        // like with circular references for example.
        return new Error(String(maybeError));
    }
}

export function getErrorMessage(error: unknown) {
    return toErrorWithMessage(error).message;
}
