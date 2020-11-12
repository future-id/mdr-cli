import {
    Command,
    command,
    Options,
    option,
    metadata,
    // SubcommandDefinition
} from "clime";

// export const subcommands: SubcommandDefinition[] = [
//     {
//         name: "",
//         alias: "",
//         brief: ""
//     }
// ];

export class CmdOptions extends Options {
    @option({
        name: "temp",
        flag: "t",
        description: "Temporary",
        toggle: true
    })
    temp!: boolean;
}

@command()
export default class Default extends Command {
    @metadata
    async execute(options: CmdOptions): Promise<void> {
        if (options.temp || !options.temp) {
            const help = await Default.getHelp();
            help.print(process.stdout, process.stderr);
        }
    }
}
