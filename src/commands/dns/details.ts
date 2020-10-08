// fiddev
import Api from "../../api";
import { Command, Options, command, option, metadata } from "clime";

interface Record {
    index: number;
    record_id: string;
    type: string;
    host: string;
    address: string;
    priority: string;
    weight: string;
    port: string;
}

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
}

@command({
    description: "Get dns details from a domain"
})
export default class extends Command {
    @metadata
    async execute(options: ModOptions): Promise<void> {
        await api.init();

        api.addParam("command", "dns_get_details");
        api.addParam("domein", options.domain);
        api.addParam("tld", options.tld);

        const records: Record[] = [];
        const response = await api.send();

        let recordCount = 0;
        try {
            recordCount = parseInt(response.recordcount);
        } catch (e) {
            // ?
        }

        for (let i = 0; i < recordCount; i++) {
            records.push({
                index: i,
                record_id: response[`record_id[${i}]`],
                type: response[`type[${i}]`],
                host: response[`host[${i}]`],
                address: response[`address[${i}]`],
                priority: response[`priority[${i}]`],
                weight: response[`weight[${i}]`],
                port: response[`port[${i}]`]
            });
        }

        console.log(records);
    }
}
