import ApiCommand from "../../../utils/ApiCommand";
import { logger, spinner, yn } from "../../../utils/Utils";
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
        name: "domain",
        flag: "d",
        description: "Domain name",
        required: true
    })
    domain!: string;

    @option({
        name: "tld",
        flag: "t",
        description: "TLD extension of the domain name",
        required: true
    })
    tld!: string;

    @option({
        name: "record",
        flag: "r",
        description: "Record ID of the record to be deleted",
        required: true
    })
    record_id!: number;
}

@command()
export default class extends ApiCommand {
    @metadata
    async execute(options: CmdOptions): Promise<void> {
        if (!options.quiet) spinner.start();

        this.api.newRequest(options.quiet);

        this.api.addParam("command", "dns_record_del");
        this.api.addParam("domein", options.domain);
        this.api.addParam("tld", options.tld);
        this.api.addParam("record_id", String(options.record_id));

        const response = await this.api.send();
        if (response.errcount === "0" && yn(response.done)) {
            logger.success("DNS record successfully removed!");
        }
    }
}
