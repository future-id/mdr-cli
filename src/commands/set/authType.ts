import TOML from "@iarna/toml";
import { promises as fs } from "fs";
import { Command, command, param, metadata } from "clime";
import { AuthType, CONFIG_FILE, getConfig, logger } from "../../utils/Utils";

@command()
export default class extends Command {
    @metadata
    async execute(@param({ description: "Auth type, either plain or md5", required: true }) type: AuthType): Promise<void> {
        try {
            const config = await getConfig();

            if (config.useSSL === false && type === "plain") {
                logger.error("Can't set auth type to plain when ssl is disabled");
                process.exit(1);
            }

            config.authType = type;
            const toml = TOML.stringify(config);
            await fs.writeFile(CONFIG_FILE, toml, "utf-8");
            logger.info("Auth type successfully updated");
        } catch (e) {
            logger.error("Failed to update auth type");
        }
    }
}
