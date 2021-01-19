import { SubcommandDefinition } from "clime";

export const subcommands: SubcommandDefinition[] = [
    {
        name: "list",
        alias: "ls",
        brief: "List all domains"
    },
    {
        name: "record",
        brief: "Get domain record data"
    },
    {
        name: "template",
        brief: "Get template id from domain"
    }
];
