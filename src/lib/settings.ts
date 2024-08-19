import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import logger from "@core/log";
import {RulesetOptions} from "@core/lib/rules/interfaces";
import Ajv from "ajv";

const SCHEMA_PATH = './schema/schema.json';

const SETTINGS_PATH = process.env.CONFIG_DIRECTORY
    ? `${process.env.CONFIG_DIRECTORY}/settings.yaml`
    : path.join(__dirname, '../../config/settings.yaml');

export interface YamlSettings {
    config: CrawlrrSettings
}

export interface CrawlrrSettings {
    overseerr: OverseerSettings;
    plex?: PlexSettings;
    discovery?: DiscoverySettings;
    smartRecommendations?: SmartRecommendationsSettings;
    rulesets: RulesetOptions[]
}

export interface RulesetConsumer {
    ruleset?: string;
}

export interface OverseerSettings {
    apiUrl: string;
    user?: string;
    password?: string;
    dryRun?: boolean;
}

export interface PlexSettings {
    apiUrl: string;
    plexToken: string;
}

export interface DiscoverySettings extends RulesetConsumer{
    cron?: string;
    streams?: string[];
}

export interface SmartRecommendationsSettings extends RulesetConsumer{
    cron: string;
    plexLibrary: string;
    minimumRating: number;
}

export interface OnSettingLoadedCallback {
    (settings: Settings): Promise<void>;
}

class Settings {
    private _data: CrawlrrSettings;
    private initialized: boolean;
    private callback: OnSettingLoadedCallback | undefined;

    constructor() {
        this.initialized = false;
        this._data = {
            overseerr: {
                apiUrl: ''
            },
            rulesets: []
        };
    }

    public load(): Settings {
        if (this.initialized) {
            return this;
        }
        logger.info('Loading settings...');

        if (!fs.existsSync(SETTINGS_PATH)) {
            throw new Error(`Could not find configuration file '${SETTINGS_PATH}' !`);
        }

        try {
            const yamlSettings = yaml.load(fs.readFileSync(SETTINGS_PATH, 'utf8')) as YamlSettings;
            const schema = JSON.parse(fs.readFileSync(SCHEMA_PATH, 'utf8'));
            const validator = new Ajv();
            const isValid = validator.validate(schema, yamlSettings);

            if (!isValid) {
                throw new Error(`Invalid configuration file. ${JSON.stringify(validator.errors)}`);
            }

            this._data = yamlSettings.config as CrawlrrSettings;
            if (process.env.NODE_ENV !== 'production') {
                console.log(this._data)
            }
            this.initialized = true;
            logger.info(`Settings loaded successfully from ${SETTINGS_PATH}`);
            if (this.callback) {
                this.callback(this);
            }
        } catch (e) {
            logger.error(e);
        }
        return this;
    }

    private reload = () => {
        logger.info(`Configuration file changed. Reloading...`);
        this.initialized = false;
        this.load();
    }

    public watch(callback: OnSettingLoadedCallback) {
        fs.watchFile(SETTINGS_PATH, this.reload);
        this.callback = callback;
        return this;
    }

    get overseerr(): OverseerSettings {
        return this._data.overseerr;
    }

    get plex(): PlexSettings | null {
        return this._data.plex ?? null;
    }

    get rulesets(): RulesetOptions[] {
        return this._data.rulesets;
    }

    get discovery(): DiscoverySettings {
        return this._data.discovery ?? {
            cron: '? ? ? * * *',
            streams: ['upcoming']
        };
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
}

export default Settings;
