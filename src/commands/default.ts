import { Command, command, Options, option, metadata } from "clime";
import { version } from "../../package.json";

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
            console.log(`v${version}`);
        } else {
            const help = await Default.getHelp();
            help.print(process.stdout, process.stderr);
        }
    }
}
