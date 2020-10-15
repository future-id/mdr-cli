#! /usr/bin/env node

import path from "path";
import checkForUpdates from "update-check";
import pkg from "../package.json";
import { CLI, Shim } from "clime";
import { createConfig, getConfigSync, logger, validateConfig } from "./utils/Utils";
import chalk from "chalk";

async function main(): Promise<void> {
    await createConfig();

    let update = null;
    try {
        update = await checkForUpdates(pkg);
    } catch (err) {}

    if (update) {
        logger.warn(`You're using an old version of ${chalk.bold(pkg.name)}, please update to the latest version ${chalk.bold(update.latest)} using "npm i -g mdr-cli@latest"`);
    }

    const test = process.argv[2];
    if (test !== "set") {
        // Validate config synchronious
        const config = getConfigSync();
        validateConfig(config);
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
