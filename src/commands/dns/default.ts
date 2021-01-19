import { SubcommandDefinition } from "clime";

export const subcommands: SubcommandDefinition[] = [
    {
        name: "record",
        brief: "Add/remove dns records"
    },
    {
        name: "template",
        alias: "temp",
        brief: "Create, add, list or modify dns template records"
    },
    {
        name: "details",
        alias: "info",
        brief: "Get dns details from a domain"
    },
    {
        name: "modify",
        aliases: [
            "mod",
            "edit"
        ],
        brief: "Modify dns records"
    }
];
