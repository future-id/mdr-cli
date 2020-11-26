import ApiCommand from "../../../utils/ApiCommand";
import { spinner, logger, yn } from "../../../utils/Utils";
import { Options, command, option, metadata } from "clime";

class CmdOptions extends Options {
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
        name: "template-id",
        flag: "i",
        description: "Template id the record is part off",
        required: true
    })
    template_id!: number;

    @option({
        name: "record",
        flag: "r",
        description: "recordId of the template record to be changed",
        required: true
    })
    record!: number;

    @option({
        name: "host",
        flag: "h",
        description: "Host name of the template record",
        required: true
    })
    host!: string;

    @option({
        name: "address",
        flag: "a",
        description: "Address/url/host name of new record",
        required: true
    })
    address!: string;

    @option({
        name: "quiet",
        flag: "q",
        description: "Disables the loading indicator",
        required: false,
        toggle: true,
        default: false
    })
    quiet!: boolean;
}

@command()
export default class extends ApiCommand {
    @metadata
    async execute(options: CmdOptions): Promise<void> {
        if (!options.quiet) spinner.start();

        this.api.newRequest(options.quiet);

        this.api.addParam("command", "dns_template_record_modify");
        this.api.addParam("domein", options.domain);
        this.api.addParam("tld", options.tld);
        this.api.addParam("template_id", String(options.template_id));
        this.api.addParam("record_id", String(options.record));
        this.api.addParam("host", options.host);
        this.api.addParam("address", options.address);

        const response = await this.api.send();
        if (response.errcount === "0" && yn(response.done)) {
            logger.success("DNS template record successfully modified!");
        }
    }
}
