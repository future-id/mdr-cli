import Api from "../../api";
import { Command, command, metadata } from "clime";

interface Domain {
    index: number;
    domain: string;
    registrant: string;
    registrant_id: string;
    admin: string;
    admin_id: string;
    tech: string;
    tech_id: string;
    bill: string;
    bill_id: string;
    ns_id: string;
    dns_template: string;
    verloopdatum: string;
    inaccountdatum: string;
    status: string;
    autorenew: string;
}

const api = new Api();

@command({
    description: "List all domains"
})
export default class extends Command {
    @metadata
    async execute(): Promise<void> {
        await api.init();

        api.addParam("command", "domain_list");

        // Optional params
        // api.addParam("tld", "");
        api.addParam("sort", "domein");
        // api.addParam("order", "");
        // api.addParam("begin", "");

        const domains: Domain[] = [];
        const response = await api.send();

        let domainCount = 0;
        try {
            domainCount = parseInt(response.domeincount);
        } catch (e) {
            // ?
        }

        for (let i = 0; i < domainCount; i++) {
            domains.push({
                index: i,
                domain: response[`domein[${i}]`],
                registrant: response[`registrant[${i}]`],
                registrant_id: response[`registrant_id[${i}]`],
                admin: response[`admin[${i}]`],
                admin_id: response[`admin_id[${i}]`],
                tech: response[`tech[${i}]`],
                tech_id: response[`tech_id[${i}]`],
                bill: response[`bill[${i}]`],
                bill_id: response[`bill_id[${i}]`],
                ns_id: response[`ns_id[${i}]`],
                dns_template: response[`dns_template[${i}]`],
                verloopdatum: response[`verloopdatum[${i}]`],
                inaccountdatum: response[`inaccountdatum[${i}]`],
                status: response[`status[${i}]`],
                autorenew: response[`autorenew[${i}]`]
            });
        }

        console.log(domains);
    }
}
