import yn from "yn";
import Api from "../../../api";
import { spinner, logger } from "../../../utils/Utils";
import { Command, Options, command, option, metadata } from "clime";

const api = new Api();

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
}

@command()
export default class extends Command {
    @metadata
    async execute(options: CmdOptions): Promise<void> {
        spinner.start();
        await api.init();

        api.newRequest();

        api.addParam("command", "dns_template_record_modify");
        api.addParam("domein", options.domain);
        api.addParam("tld", options.tld);
        api.addParam("template_id", String(options.template_id));
        api.addParam("record_id", String(options.record));
        api.addParam("host", options.host);
        api.addParam("address", options.address);

        const response = await api.send();
        if (response.errcount === "0" && yn(response.done)) {
            logger.success("DNS template record successfully modified!");
        }
    }
}
