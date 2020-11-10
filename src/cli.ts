#! /usr/bin/env node

import path from "path";
import chalk from "chalk";
import checkForUpdates from "update-check";
import pkg from "../package.json";
import { CLI, Shim } from "clime";
import { configExists, createConfig, getConfigSync, logger } from "./utils/Utils";

async function main(): Promise<void> {
    if (!configExists()) {
        await createConfig();
    }

    let update = null;
    try {
        update = await checkForUpdates(pkg);
    } catch (err) {}

    if (update) {
        logger.warn(`You're using an old version of ${chalk.bold(pkg.name)}, please update to the latest version ${chalk.bold(update.latest)} using ${chalk.bold("npm i -g mdr-cli@latest")}`);
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
