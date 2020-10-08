import yn from "yn";
import TOML from "@iarna/toml";
import { promises as fs } from "fs";
import { Command, command, param, metadata } from "clime";
import { CONFIG_FILE, getConfig, logger } from "../../utils/Utils";

@command()
export default class extends Command {
    @metadata
    async execute(@param({ description: "Whether to use ssl when making requests", required: true }) useSSL: string): Promise<void> {
        const res = yn(useSSL);
        // Specifically check for undefined and null since "false" is a valid value
        if (res === undefined || res === null) {
            logger.error("Invalid parameter, please use either of yes, y, true, no, n or false");
            process.exit(1);
        }

        try {
            const config = await getConfig();

            if (config.authType === "plain" && res === false) {
                logger.error('Can\'t set ssl to false when auth type is "plain"');
                process.exit(1);
            }

            config.useSSL = res;
            const toml = TOML.stringify(config);
            await fs.writeFile(CONFIG_FILE, toml, "utf-8");
            logger.info("Use SSL successfully updated");
        } catch (e) {
            logger.error("Failed to update use SSL");
        }
    }
}
