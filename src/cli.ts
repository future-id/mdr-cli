#! /usr/bin/env node

/**
 * @file Main cli file which handles all the commands
 * @version 1.3.2
 * @author Pepijn van den Broek <pepijn@vdbroek.dev>
 * @license MIT
 */

import path from "path";
import chalk from "chalk";
import checkUpdate from "update-check";
import pkg from "../package.json";
import boxen from "boxen";
import { CLI, Shim } from "clime";
import {
    configExists,
    createConfig,
    getConfigSync,
    logger,
    isYarn,
    isDebug,
    isDev
} from "./utils/Utils";
import { BorderStyle } from "./utils/Types";

async function main(): Promise<void> {
    if (!configExists()) {
        await createConfig();
    }

    // Only validate config when subcommand is not `set` since `set` is used to configure the config
    // Also only check for updates when we can validate the config to make sure there is a valid lastNotification timestamp
    // I don't think `set` is used that often to even need an update notification
    const cmd = process.argv[2];
    if (cmd !== "set") {
        // Validate config synchronious
        const config = getConfigSync().validate();
        // Check if update notification is at least 12 hours ago
        // To not bother the user if they really don't want to update or the latest version is unusable
        const diff = isDebug() ? 12 : (Date.now() - config.lastNotification) / 1000 / 60 / 60;
        if (diff >= 12) {
            let update = null;
            try {
                update = await checkUpdate(pkg);
            } catch (err) {}

            if (update) {
                let updateCommand = `npm update -g ${pkg.name}`;
                if (isYarn()) {
                    updateCommand = `yarn global add ${pkg.name}@latest`;
                }

                const message = boxen(`Update available ${chalk.dim(pkg.version)} → ${chalk.green(update.latest)}\nRun ${chalk.cyan(updateCommand)} to update`, {
                    padding: 1,
                    margin: 1,
                    align: "center",
                    borderColor: "yellow",
                    borderStyle: BorderStyle.Round
                });

                logger.log(message);

                config.updateNotification();
            }
        }
    }

    // When in development and we use ts-node make sure the commands loaded use .ts extension
    if (isDev() && __filename.endsWith(".ts")) {
        CLI.commandModuleExtension = ".ts";
    }

    const cli = new CLI("mdr", path.join(__dirname, "commands"));
    const shim = new Shim(cli);
    await shim.execute(process.argv);
}

main().catch((e) => {
    logger.error(e);
    process.exit(1);
});
