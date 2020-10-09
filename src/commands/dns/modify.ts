import Api from "../../api";
import { spinner } from "../../utils/Utils";
import { Command, Options, command, option, metadata } from "clime";

const api = new Api();

export class ModOptions extends Options {
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
        description: "recordId of the record to be changed",
        required: true
    })
    record!: number;

    @option({
        name: "host",
        flag: "h",
        description: "Host name of the record",
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

@command({
    description: "Modify dns records"
})
export default class extends Command {
    @metadata
    async execute(options: ModOptions): Promise<void> {
        spinner.start();
        await api.init();

        api.addParam("command", "dns_record_modify");
        api.addParam("domein", options.domain);
        api.addParam("tld", options.tld);
        api.addParam("record_id", String(options.record));
        api.addParam("host", options.host);
        api.addParam("address", options.address);

        const response = await api.send();
        console.log(response);
    }
}
