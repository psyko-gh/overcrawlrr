import express from 'express';
import envVar from '@core/env';
import logger from '@core/log';
import Settings, { getSettings, OnSettingLoadedCallback } from '@core/lib/settings';
import apiRouter from '@core/routes';
import { loadRulesets } from '@core/lib/ruleset';
import { registerCrons } from '@core/lib/cron';
import OverseerrApi from '@core/api/overseerr';
import PlexApi from '@core/api/plex';
import minimist from 'minimist';
import * as process from 'process';
import path from 'path';
import fs from 'fs';

export type CliArguments = {
    config?: string;
    port?: number;
};

const argv = minimist(process.argv.slice(2)) as CliArguments;

const cliPath = argv.config;
const envPath = envVar('CONFIG', '/config/settings.yaml') as string;
const reifiedPath = path.resolve(__dirname, cliPath ?? envPath);
const stats = fs.statSync(reifiedPath);
const configPath = stats.isDirectory() ? path.resolve(reifiedPath, 'settings.yaml') : reifiedPath;

const onLoad: OnSettingLoadedCallback = async (settings: Settings) => {
    loadRulesets(settings);
    registerCrons(settings);

    // Testing settings
    const overseerr = new OverseerrApi();
    await overseerr.test();

    if (settings.plex) {
        const plex = new PlexApi();
        await plex.test();
    }
};

getSettings().watch(configPath, onLoad);

const app = express();
const port = argv.port ?? envVar('PORT', 5056);

app.use('/api', apiRouter);
app.listen(port, () => {
    return logger.info(`Overcrawlrr is listening at http://localhost:${port} `);
});
