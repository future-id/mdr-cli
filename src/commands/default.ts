import pkg from "../../package.json";
import checkForUpdates from "update-check";
import {
    Command,
    command,
    Options,
    option,
    metadata,
    SubcommandDefinition,
    HelpInfo
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
        brief: "Get mdr config values"
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
    async execute(options: CmdOptions): Promise<string | HelpInfo> {
        if (options.version) {
            let update = null;
            try {
                update = await checkForUpdates(pkg);
            } catch (err) {}

            return `v${pkg.version}${update ? ` | latest: v${update.latest}` : ""}`;
        }

        return Default.getHelp();
    }
}
