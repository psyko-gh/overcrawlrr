import type {AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig} from "axios";
import axios from "axios";
import NodeCache from "node-cache";
import logger from "@core/log";
import cookie from 'cookie';

const DEFAULT_TTL = 100;
const COOKIE_NAME = 'connect.sid';

interface HttpApiOptions {
    cache?: NodeCache;
    headers?:  Record<string, unknown>;
}

class HttpApi {
    protected axios: AxiosInstance;
    private cookie:string;
    private baseUrl: string;
    private cache?: NodeCache;

    constructor(
        baseUrl: string,
        params: Record<string, unknown>,
        options: HttpApiOptions = {},
        debug: Boolean = false
    ) {
        this.cookie = '';
        this.baseUrl = baseUrl;
        this.cache = options.cache;

        this.axios = axios.create({
            baseURL: baseUrl,
            withCredentials: true,
            params,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...options.headers
            }
        });
        this.activateCookieInterceptor();
        if (debug) {
            this.enableDebug();
        }
    }

    protected async get<T>(
        endpoint: string,
        config?: AxiosRequestConfig,
        ttl?: number
    ): Promise<T> {
        const cacheKey = this.getCacheKey(endpoint, config?.params);
        const cachedResult = this.cache?.get<T>(cacheKey);
        if (cachedResult) {
            logger.debug('Served from cache ' + cacheKey)
            return cachedResult;
        }

        const response = await this.axios.get<T>(endpoint, config);

        if (this.cache) {
            this.cache.set<T>(cacheKey, response.data, ttl ?? DEFAULT_TTL);
        }

        return response.data;
    }

    protected async post<T>(
        endpoint: string,
        data: Record<string, unknown>,
        config?: AxiosRequestConfig<any>,
        ttl?: number
    ): Promise<T> {
        const cacheKey = this.getCacheKey(endpoint, config?.params);
        // const cachedResult = this.cache?.get<T>(cacheKey);
        // if (cachedResult) {
        //     return cachedResult;
        // }

        const response = await this.axios.post<T>(endpoint, data, config);

        // if (this.cache) {
        //     this.cache.set<T>(cacheKey, response.data, ttl ?? DEFAULT_TTL);
        // }

        return response.data;
    }

    private getCacheKey(
        endpoint: string,
        params: Record<string, unknown>
    ): string {
        if (!params) {
            return `${this.baseUrl}${endpoint}`;
        }
        return `${this.baseUrl}${endpoint}${JSON.stringify(params)}`;
    }

    private activateCookieInterceptor() {
        this.axios.interceptors.request.use((req: InternalAxiosRequestConfig) => {
            if (this.cookie) {
                req.headers.cookie = cookie.serialize(COOKIE_NAME, this.cookie);
            }
            return req;
        });

        this.axios.interceptors.response.use((res) => {
            if (res.headers['set-cookie']) {
                const cookies = res.headers['set-cookie']as string[];
                const c = cookie.parse(cookies.shift() ?? '');
                this.cookie = c[COOKIE_NAME];
            }
            return res;
        });
    }

    private enableDebug() {
        this.axios.interceptors.request.use((x: InternalAxiosRequestConfig)  => {
            const method = x.method ?? '';
            const headers = {
                ... x.headers.common,
                ... x.headers[method],
                ... x.headers
            }

            // remove irrelevant headers
            const removed = ['common', 'get', 'post', 'head', 'put', 'patch', 'delete'];
            removed.forEach(h => delete headers[h]);

            const printable = `Request: ${method.toUpperCase()} ${x.baseURL} | ${x.url} | ${Object.keys(x.params).map(k => `${k}: ${x.params[k]}`).join(', ')} | ${JSON.stringify(x.data)} | ${JSON.stringify(x.headers)}`
            logger.debug(printable);

            return x;
        });

        this.axios.interceptors.response.use(x => {
            logger.debug(`Response: ${x.status} | ${JSON.stringify(x.data)} | ${JSON.stringify(x.headers)}`);
            return x;
        });
    }
}

export default HttpApi;