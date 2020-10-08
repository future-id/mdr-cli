import TOML from "@iarna/toml";
import { promises as fs } from "fs";
import { Command, command, param, metadata } from "clime";
import { CONFIG_FILE, getConfig, logger } from "../../utils/Utils";

@command()
export default class extends Command {
    @metadata
    async execute(@param({ description: "New username", required: true }) name: string): Promise<void> {
        try {
            const config = await getConfig();
            config.user = name;
            const toml = TOML.stringify(config);
            await fs.writeFile(CONFIG_FILE, toml, "utf-8");
            logger.info("Username successfully updated");
        } catch (e) {
            logger.error("Failed to update username");
        }
    }
}
