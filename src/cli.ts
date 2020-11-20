#! /usr/bin/env node

/**
 * @file Main cli file which handles all the commands
 * @version 1.3.1
 * @author Pepijn van den Broek <pepijn@vdbroek.dev>
 * @license MIT
 */

import path from "path";
import chalk from "chalk";
import checkUpdate from "update-check";
import pkg from "../package.json";
import boxen, { BorderStyle } from "boxen";
import { CLI, Shim } from "clime";
import { configExists, createConfig, getConfigSync, logger, isYarn } from "./utils/Utils";

async function main(): Promise<void> {
    if (!configExists()) {
        await createConfig();
    }

    let update = null;
    try {
        update = await checkUpdate(pkg);
    } catch (err) {}

    if (update) {
        let updateCommand = `npm update -g ${pkg.name}`;
        if (isYarn()) {
            updateCommand = `yarn global upgrade ${pkg.name}`;
        }

        const message = boxen(`Update available ${chalk.dim(pkg.version)} → ${chalk.green(update.latest)}\nRun ${chalk.cyan(updateCommand)} to update`, {
            padding: 1,
            margin: 1,
            align: "center",
            borderColor: "yellow",
            borderStyle: BorderStyle.Round
        });

        logger.log(message);
    }

    const cmd = process.argv[2];
    if (cmd !== "set") {
        // Validate config synchronious
        const config = getConfigSync();
        config.validate();
    }

    // When in development and we use ts-node make sure the commands loaded use .ts extension
    if (process.env.NODE_ENV === "development" && __filename.endsWith(".ts")) {
        CLI.commandModuleExtension = ".ts";
    }

    const cli = new CLI("mdr", path.join(__dirname, "commands"));

    const shim = new Shim(cli);
    shim.execute(process.argv);
}

main().catch((e) => {
    logger.error(e);
    process.exit(1);
});
