# mdr-cli
cli to interact with the mijndomeinreseller api \
MijnDomeinReseller docs: https://pepijn98.github.io/mdr-cli/

# Installation
`npm i -g mdr-cli@latest` or `yarn global add mdr-cli@latest`

# Setup
Initial usage will create a config file under your OS's preferred path \
linux: `/home/<user>/.config/mdr-cli/settings.toml` \
mac: `/Users/<user>/Library/Preferences/mdr-cli/settings.toml` \
windows: `Users\<user>\AppData\mdr-cli\settings.toml` \
It will quit after creating the config because you have to add a user and pssword to this file. \
Use `mdr set username <name>` and `mdr set password <pass>` for this!

# Usage
mdr \<subcommand\>

- `dns`
    - `template` - Create, add, list or modify dns template records
        - `details`, `info` - Get details about a specific dns template
            - `-i`, `--template-id` \<template_id\> - Template ID **[required]**
        - `list` - Get a list of all dns templates
        - `modify`, `mod` - Modify dns template records
            - `-d`, `--domain` \<domain\>   - Domain name **[required]**
            - `-t`, `--tld` \<tld\>         - TLD extension of the domain name **[required]**
            - `-i`, `--template-id` \<template_id\> - Template id the record is part off **[required]**
            - `-r`, `--record` \<record\>   - recordId of the template record to be changed **[required]**
            - `-h`, `--host` \<host\>       - Host name of the template record **[required]**
            - `-a`, `--address` \<address\> - Address, url or host name of new record **[required]**
    - `details`, `info` - Get dns details from a domain
        - `-d`, `--domain` <domain>     - Domain name **[required]**
        - `-t`, `--tld` <tld>           - TLD extension of the domain name **[required]**
    - `modify`, `mod`  - Modify dns records
        - `-d`, `--domain` \<domain\>   - Domain name **[required]**
        - `-t`, `--tld` \<tld\>         - TLD extension of the domain name **[required]**
        - `-r`, `--record` \<record\>   - recordId of the record to be changed **[required]**
        - `-h`, `--host` \<host\>       - Host name of the record **[required]**
        - `-a`, `--address` \<address\> - Address, url or host name of new record **[required]**
- `domain`
    - `list` - List all domains
        - `-t`, `--tld`   - Filter for a specific tld **[optional]**
        - `-s`, `--sort`  - Sort the list. Valid options are domein, registrant, admin, tech, verloopdatum or status **[optional]**
        - `-o`, `--order` - Specify in which order it should be shown (asc or desc) **[optional]**
        - `-b`, `--begin` - Show domain names starting with a letter of the alphabet, values: a-z or 0-9 **[optional]**
- `set`
    - `apiPath`, `path`                         - Update api path in config file **[required]**
    - `authType`, `auth`                        - Update auth type in config file (plain or md5) **[required]**
    - `host`                                    - Update host in config file **[required]**
    - `password`, `pwd`, `pw`, `pass`, `passwd` - Update the password in the config file **[required]**
    - `ssl`                                     - Enable or disable ssl in the config file, when disabled auth type has to be md5 **[required]**
    - `username`, `user`                        - Update the username in the config file **[required]**
