import ApiCommand from "../../../../utils/ApiCommand";
import { logger, spinner, yn } from "../../../../utils/Utils";
import { command, metadata, option, Options } from "clime";

class CmdOptions extends Options {
    @option({
        name: "quiet",
        flag: "q",
        description: "Disables the loading indicator",
        required: false,
        toggle: true,
        default: false
    })
    quiet!: boolean;

    @option({
        name: "template-id",
        flag: "i",
        description: "Template ID",
        required: true
    })
    template_id!: number;

    @option({
        name: "type",
        flag: "r",
        description: "Record type A, AAAA, TXT, MX.....",
        required: true
    })
    type!: string;

    @option({
        name: "host",
        flag: "h",
        description: "Hostname of the record",
        required: true
    })
    host!: string;

    @option({
        name: "address",
        flag: "a",
        description: "Address/url/hostname of new record",
        required: true
    })
    address!: string;

    @option({
        name: "priority",
        flag: "p",
        description: "Priority of the new record (SRV/MX ONLY)",
        required: false
    })
    priority!: string;

    @option({
        name: "weight",
        flag: "w",
        description: "Weight of the new record (SRV ONLY)",
        required: false
    })
    weight!: string;

    @option({
        name: "port",
        description: "Port of the new record (SRV ONLY)",
        required: false
    })
    port!: string;
}

@command()
export default class extends ApiCommand {
    @metadata
    async execute(options: CmdOptions): Promise<void> {
        if (!options.quiet) spinner.start();

        this.api.newRequest(options.quiet);

        this.api.addParam("command", "dns_template_record_add");
        this.api.addParam("template_id", String(options.template_id));
        this.api.addParam("type", options.type);
        this.api.addParam("host", options.host);
        this.api.addParam("address", options.address);

        if (options.type.toUpperCase() === "MX") {
            this.api.addParam("priority", options.priority);
        }

        if (options.type.toUpperCase() === "SRV") {
            this.api.addParam("priority", options.priority);
            this.api.addParam("weight", options.weight);
            this.api.addParam("port", options.port);
        }

        const response = await this.api.send();
        if (response.errcount === "0" && yn(response.done)) {
            logger.success("DNS template record successfully added!");
        }
    }
}
