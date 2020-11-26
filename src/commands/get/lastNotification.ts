import chalk from "chalk";
import { Command, command, metadata } from "clime";
import { getConfig, logger } from "../../utils/Utils";

@command()
export default class extends Command {
    @metadata
    async execute(): Promise<void> {
        try {
            const config = await getConfig();
            logger.log(`${chalk.bold(new Date(config.lastNotification).toLocaleString())} (${config.lastNotification})`);
        } catch (e) {
            logger.error("Failed to get auth type");
        }
    }
}
