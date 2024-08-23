import express from 'express';
import cors from 'cors';
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

export type CliArguments = {
    config?: string;
    port?: number;
};

const argv = minimist(process.argv.slice(2)) as CliArguments;

const configPath = path.resolve(__dirname, argv.config ?? path.resolve(__dirname, envVar('CONFIG', '/config/settings.yaml') as string));

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

const corsOptions = {
    origin: [`http://localhost`, `http://localhost:${port}`, `http://127.0.0.1`, `http://127.0.0.1:${port}`],
    credentials: true,
    exposedHeaders: ['set-cookie'],
};

app.use(cors(corsOptions));
app.use('/api', apiRouter);

app.listen(port, () => {
    return logger.info(`Server is listening at http://localhost:${port}`);
});
