import dotenv from 'dotenv'
import express from 'express';
import cors from 'cors';
import envVar from "@core/env";
import logger from "@core/log";
import Settings, {getSettings, OnSettingLoadedCallback} from "@core/lib/settings";
import apiRouter from "@core/routes";
import {loadRulesets} from "@core/lib/ruleset";
import {registerCrons} from "@core/lib/cron";
import OverseerrApi from "@core/api/overseerr";
import PlexApi from "@core/api/plex";
import fs from "fs";

dotenv.config()

const app = express();
const port = envVar('PORT', 5056);

const corsOptions = {
    origin: [
        `http://localhost`,
        `http://localhost:${port}`,
        `http://127.0.0.1`,
        `http://127.0.0.1:${port}`
    ],
    credentials: true,
    exposedHeaders: ['set-cookie'],
};

app.use(cors(corsOptions));
app.use('/api', apiRouter);

app.listen(port, () => {
    return logger.info(`Server is listening at http://localhost:${port}`);
});

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

getSettings()
    .watch(onLoad)
    .load();

