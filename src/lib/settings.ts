import fs from 'fs';
import yaml from 'js-yaml';
import logger from '@core/log';
import { RulesetOptions } from '@core/lib/rules/interfaces';
import Ajv from 'ajv';
import envVar from '@core/env';

const SCHEMA_PATH = './schema/schema.json';

export interface YamlSettings {
    config: CrawlrrSettings;
}

export interface CrawlrrSettings {
    overseerr: OverseerSettings;
    plex?: PlexSettings;
    discovery?: DiscoverySettings;
    smartRecommendations?: SmartRecommendationsSettings;
    rulesets: RulesetOptions[];
}

export interface RulesetConsumer {
    ruleset?: string;
}

export interface OverseerSettings {
    apiUrl: string;
    user: string;
    password: string;
    dryRun?: boolean;
}

export interface PlexSettings {
    apiUrl: string;
    plexToken: string;
}

export interface DiscoverySettings extends RulesetConsumer {
    cron?: string;
    streams?: string[];
}

export interface SmartRecommendationsSettings extends RulesetConsumer {
    cron: string;
    plexLibrary: string;
    minimumRating: number;
}

export interface OnSettingLoadedCallback {
    (settings: Settings): Promise<void>;
}

class Settings {
    private path: string;
    private _data: CrawlrrSettings;
    private initialized: boolean;
    private callback: OnSettingLoadedCallback | undefined;

    constructor() {
        this.initialized = false;
        this.path = '/config/settings.yaml';
        this._data = {
            overseerr: {
                apiUrl: '',
                user: '',
                password: '',
            },
            rulesets: [],
        };
    }

    private load(): Settings {
        if (this.initialized) {
            return this;
        }
        logger.info('Loading settings...');

        if (!fs.existsSync(this.path)) {
            throw new Error(`File does not exist: '${this.path}' !`);
        }

        try {
            const yamlSettings = yaml.load(fs.readFileSync(this.path, 'utf8')) as YamlSettings;
            const schema = JSON.parse(fs.readFileSync(SCHEMA_PATH, 'utf8'));
            const validator = new Ajv();
            const isValid = validator.validate(schema, yamlSettings);

            if (!isValid) {
                throw new Error(`Invalid configuration file. ${JSON.stringify(validator.errors)}`);
            }

            this._data = yamlSettings.config as CrawlrrSettings;

            // Resolve environment variables used in config
            this._data.overseerr.user = this.resolveEnvironmentVariable(this._data.overseerr.user);
            this._data.overseerr.password = this.resolveEnvironmentVariable(this._data.overseerr.password);
            if (this._data.plex) {
                this._data.plex.plexToken = this.resolveEnvironmentVariable(this._data.plex.plexToken);
            }

            this.initialized = true;
            logger.info(`Settings loaded successfully from ${this.path}`);

            if (this.callback) {
                this.callback(this);
            }
        } catch (e) {
            logger.error(e);
        }
        return this;
    }

    private resolveEnvironmentVariable(value: string) {
        let resolvedValue = value;
        const envRegex = /{{ +([A-Z_]+) +}}/gm;
        const match = envRegex.exec(value);
        if (match !== null) {
            resolvedValue = envVar(match[1]) as string;
        }
        return resolvedValue;
    }

    private reload = () => {
        logger.info(`Configuration file changed. Reloading...`);
        this.initialized = false;
        this.load();
    };

    public watch(path: string, callback: OnSettingLoadedCallback) {
        this.path = path;
        fs.watchFile(this.path, this.reload);
        this.callback = callback;
        this.load();
        return this;
    }

    get overseerr(): OverseerSettings {
        return this._data.overseerr;
    }

    get overseerrUser(): string {
        return this._data.overseerr.user ?? '';
    }

    get overseerrPassword(): string {
        return this._data.overseerr.password ?? '';
    }

    get plex(): PlexSettings | null {
        return this._data.plex ?? null;
    }

    get plexToken(): string {
        return envVar('PLEX_TOKEN', this._data.plex?.plexToken ?? '') as string;
    }

    get rulesets(): RulesetOptions[] {
        return this._data.rulesets;
    }

    get discovery(): DiscoverySettings {
        return (
            this._data.discovery ?? {
                cron: '? ? ? * * *',
                streams: ['upcoming'],
            }
        );
    }

    get smartRecommendations(): SmartRecommendationsSettings | null {
        return this._data.smartRecommendations ?? null;
    }
}

let settings: Settings | undefined;

export const getSettings = (): Settings => {
    if (!settings) {
        settings = new Settings();
    }
    return settings;
};

export default Settings;
