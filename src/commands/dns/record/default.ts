import { SubcommandDefinition } from "clime";

export const subcommands: SubcommandDefinition[] = [
    {
        name: "add",
        alias: "new",
        brief: "Add a new record"
    },
    {
        name: "remove",
        aliases: [
            "delete",
            "del",
            "rm"
        ],
        brief: "Delete an existing record"
    }
];
