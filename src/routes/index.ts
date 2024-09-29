import express from 'express';
import OverseerrApi from '@core/api/overseerr';
import { getRuleset } from '@core/lib/ruleset';
import { discover, smartRecommendations } from '@core/service';
import { getErrorMessage } from '@core/lib/utils';

export const apiRouter = express.Router();

apiRouter.use('/healthcheck', async (req, res) => {
    res.status(200).json({
        status: 'ok',
    });
});

apiRouter.use('/movies/upcoming', async (req, res) => {
    const overseerr = new OverseerrApi();
    await overseerr.auth();
    const data = await overseerr.getUpcoming();
    res.status(200).json(data);
});

apiRouter.use('/movies/popular', async (req, res) => {
    const overseerr = new OverseerrApi();
    await overseerr.auth();
    const data = await overseerr.getPopular();
    res.status(200).json(data);
});

apiRouter.use('/search', async (req, res) => {
    const overseerr = new OverseerrApi();
    await overseerr.auth();
    const data = await overseerr.getUpcoming();
    res.status(200).json(data);
});

apiRouter.use('/movies/:id(\\d+)/evaluate/:ruleset', async (req, res) => {
    try {
        const overseerr = new OverseerrApi();
        await overseerr.auth();
        const movie = await overseerr.getMovie(Number(req.params.id));
        const result = getRuleset(req.params.ruleset).evaluateRules(movie);
        res.status(200).json(result);
    } catch (e: unknown) {
        throw new Error(getErrorMessage(e));
    }
});

apiRouter.use('/movies/:id(\\d+)/request', async (req, res) => {
    const overseerr = new OverseerrApi();
    await overseerr.auth();
    const result = overseerr.requestMovie(Number(req.params.id));
    res.status(200).json(result);
});

apiRouter.use('/movies/:id(\\d+)', async (req, res) => {
    const overseerr = new OverseerrApi();
    await overseerr.auth();
    const data = await overseerr.getMovie(Number(req.params.id));
    res.status(200).json(data);
});

apiRouter.use('/discover', async (req, res) => {
    try {
        await discover();
        res.status(200).json({
            success: true,
            message: 'Discovery complete !',
        });
    } catch (e: unknown) {
        res.status(500).json({
            success: false,
            message: getErrorMessage(e),
        });
    }
});

apiRouter.use('/smartRecommendations', async (req, res) => {
    try {
        await smartRecommendations();
        res.status(200).json({
            success: true,
            message: 'Smart recommendations complete !',
        });
    } catch (e: unknown) {
        res.status(500).json({
            success: false,
            message: getErrorMessage(e),
        });
    }
});

export default apiRouter;
