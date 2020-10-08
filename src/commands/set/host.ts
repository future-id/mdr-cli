import TOML from "@iarna/toml";
import { promises as fs } from "fs";
import { Command, command, param, metadata } from "clime";
import { CONFIG_FILE, getConfig, logger } from "../../utils/Utils";

@command()
export default class extends Command {
    @metadata
    async execute(@param({ description: "New host name", required: true }) host: string): Promise<void> {
        try {
            const config = await getConfig();
            config.host = host;
            const toml = TOML.stringify(config);
            await fs.writeFile(CONFIG_FILE, toml, "utf-8");
            logger.info("Host successfully updated");
        } catch (e) {
            logger.error("Failed to update host");
        }
    }
}
