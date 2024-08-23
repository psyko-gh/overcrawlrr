import { Cron, CronOptions } from 'croner';
import { discover, smartRecommendations } from '@core/service';
import logger from '@core/log';
import Settings from '@core/lib/settings';

interface EnabledFunction {
    (): boolean;
}

interface ProcessFunction {
    (): Promise<void>;
}

interface JobDefinition {
    name: string;
    cronExpression: string;
    isEnabled: EnabledFunction;
    process: ProcessFunction;
}

const jobDefinitionsGetter = (settings: Settings) => [
    {
        name: 'Discover job',
        cronExpression: settings.discovery.cron ?? '',
        isEnabled: () => !!settings.discovery.cron,
        process: async () => discover(),
    },
    {
        name: 'Smart recommendations job',
        cronExpression: settings.smartRecommendations?.cron ?? '',
        isEnabled: () => !!settings.smartRecommendations,
        process: async () => smartRecommendations(),
    },
];

const jobs: Cron[] = [];
export function registerCrons(settings: Settings) {
    jobs.forEach((j) => j.stop());
    jobDefinitionsGetter(settings).forEach((jobDefinition: JobDefinition) => {
        if (!jobDefinition.isEnabled()) {
            return;
        }
        const options: CronOptions = {
            name: jobDefinition.name,
            protect: true,
        };

        const cron = Cron(jobDefinition.cronExpression, options, async () => {
            logger.info(`----- Starting : ${jobDefinition.name} ! ----- `);
            await jobDefinition.process?.();
            logger.info(`----- Completed: ${jobDefinition.name} ! ----- `);
        });
        jobs.push(cron);
        logger.info(`Registered ${jobDefinition.name}. Next run: ` + cron.nextRun());
    });
}
