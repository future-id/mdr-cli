import pkg from "../../package.json";
import checkForUpdates from "update-check";
import { version } from "../../package.json";
import {
    Command,
    command,
    Options,
    option,
    metadata,
    SubcommandDefinition
} from "clime";

export const subcommands: SubcommandDefinition[] = [
    {
        name: "dns",
        brief: "List, get details and modify dns records/templates"
    },
    {
        name: "domain",
        brief: "Domain specific commands"
    },
    {
        name: "set",
        brief: "Update mdr config file"
    },
    {
        name: "get",
        brief: "Get mdr config values (TODO)"
    }
];

export class CmdOptions extends Options {
    @option({
        name: "version",
        flag: "v",
        description: "Get current version number",
        toggle: true
    })
    version!: boolean;
}

@command()
export default class Default extends Command {
    @metadata
    async execute(options: CmdOptions): Promise<void> {
        if (options.version) {
            let update = null;
            try {
                update = await checkForUpdates(pkg);
            } catch (err) {}
            console.log(`v${version}${update ? ` | latest: v${update.latest}` : ""}`);
        } else {
            const help = await Default.getHelp();
            help.print(process.stdout, process.stderr);
        }
    }
}
