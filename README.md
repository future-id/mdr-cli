[![Build](https://github.com/future-id/mdr-cli/workflows/Build/badge.svg)](https://github.com/future-id/mdr-cli)
[![NPM Version](https://img.shields.io/npm/v/mdr-cli/latest)](https://www.npmjs.com/package/mdr-cli)
[![Dependencies](https://img.shields.io/librariesio/release/npm/mdr-cli)](https://www.npmjs.com/package/mdr-cli)
[![Maintainability](https://img.shields.io/codeclimate/maintainability/future-id/mdr-cli)](https://codeclimate.com/github/future-id/mdr-cli/maintainability)
[![Code Climate issues](https://img.shields.io/codeclimate/issues/future-id/mdr-cli)](https://codeclimate.com/github/future-id/mdr-cli/maintainability)

# mdr-cli
cli to interact with the mijndomeinreseller api \
MijnDomeinReseller docs: https://pepijn98.github.io/mdr-docs/

# Requirements
- NodeJS 14+
- npm or yarn
- mijndomeinreseller account
- internet connection :)

# Installation
`npm i -g mdr-cli@latest` or `yarn global add mdr-cli@latest`

# Updating
### Via npm
`npm update -g mdr-cli`

### Via yarn
`yarn global upgrade mdr-cli`

# Setup
Initial usage will create a config file under your OS's preferred path \
linux: `/home/<user>/.config/mdr-cli/settings.toml` \
mac: `/Users/<user>/Library/Preferences/mdr-cli/settings.toml` \
windows: `Users\<user>\AppData\mdr-cli\settings.toml` \
It will quit after creating the config because you have to add a user and pssword to this file. \
Use `mdr set username <name>` and `mdr set password <pass>` for this!

# Usage
`mdr` \<subcommand\> [...options]
- `-h`, `--help` - Show help message (`--help` also works on all subcommands, `-h` doesn't) **[optional]**
- `-v`, `--version` - Show current version **[optional]**
- `dns`
    - `record` - Add/remove dns records
        - `add`, `new` - Add a new record
            - `-q`, `--quiet`                   - Disables the loading indicator **[optional]**
            - `-d`, `--domain` \<domain\>       - Domain name **[required]**
            - `-t`, `--tld` \<tld\>             - TLD extension of the domain name **[required]**
            - `-r`, `--type` \<record_type\>    - Record type A, AAAA, TXT, MX..... **[required]**
            - `-h`, `--host` \<host\>           - Hostname of the record **[required]**
            - `-a`, `--address` \<address\>     - Address/url/hostname of new record **[required]**
            - `-p`, `--priority` \<priority\>   - Priority of the new record (SRV/MX ONLY) **[optional]**
            - `-w`, `--weight` \<weight\>       - Weight of the new record (SRV ONLY) **[optional]**
            - `--port` \<port\>                 - Port of the new record (SRV ONLY) **[optional]**
        - `remove`, `delete`, `del`, `rm` - Delete an existing record
            - `-q`, `--quiet`                   - Disables the loading indicator **[optional]**
            - `-d`, `--domain` \<domain\>       - Domain name **[required]**
            - `-t`, `--tld` \<tld\>             - TLD extension of the domain name **[required]**
            - `-r`, `--record` \<record_id\>    - Record ID of the record to be deleted **[required]**
    - `template` - Create, add, list or modify dns template records
        - `record` - Add/remove dns records
            - `add`, `new` - Add a new record to the template
                - `-q`, `--quiet`                       - Disables the loading indicator **[optional]**
                - `-i`, `--template-id` \<template_id\> - Template ID **[required]**
                - `-r`, `--type` \<record_type\>        - Record type A, AAAA, TXT, MX..... **[required]**
                - `-h`, `--host` \<host\>               - Hostname of the record **[required]**
                - `-a`, `--address` \<address\>         - Address/url/hostname of new record **[required]**
                - `-p`, `--priority` \<priority\>       - Priority of the new record (SRV/MX ONLY) **[optional]**
                - `-w`, `--weight` \<weight\>           - Weight of the new record (SRV ONLY) **[optional]**
                - `--port` \<port\>                     - Port of the new record (SRV ONLY) **[optional]**
            - `remove`, `delete`, `del`, `rm` - Delete an existing record from the template
                - `-q`, `--quiet`                       - Disables the loading indicator **[optional]**
                - `-i`, `--template-id` \<template_id\> - Template ID **[required]**
                - `-r`, `--record` \<record_id\>        - Record ID of the record to be deleted **[required]**
        - `details`, `info` - Get details about a specific dns template
            - `-i`, `--template-id` \<template_id\> - Template ID **[required]**
            - `-q`, `--quiet`                       - Disables the loading indicator **[optional]**
        - `list` - Get a list of all dns templates
            - `-q`, `--quiet` - Disables the loading indicator **[optional]**
        - `modify`, `mod` - Modify dns template records
            - `-d`, `--domain` \<domain\>           - Domain name **[required]**
            - `-t`, `--tld` \<tld\>                 - TLD extension of the domain name **[required]**
            - `-i`, `--template-id` \<template_id\> - Template id the record is part off **[required]**
            - `-r`, `--record` \<record\>           - recordId of the template record to be changed **[required]**
            - `-h`, `--host` \<host\>               - Host name of the template record **[required]**
            - `-a`, `--address` \<address\>         - Address, url or host name of new record **[required]**
            - `-q`, `--quiet`                       - Disables the loading indicator **[optional]**
    - `details`, `info` - Get dns details from a domain
        - `-d`, `--domain` \<domain\>   - Domain name **[required]**
        - `-t`, `--tld` \<tld\>         - TLD extension of the domain name **[required]**
        - `-q`, `--quiet`               - Disables the loading indicator **[optional]**
    - `modify`, `mod`  - Modify dns records
        - `-d`, `--domain` \<domain\>   - Domain name **[required]**
        - `-t`, `--tld` \<tld\>         - TLD extension of the domain name **[required]**
        - `-r`, `--record` \<record\>   - recordId of the record to be changed **[required]**
        - `-h`, `--host` \<host\>       - Host name of the record **[required]**
        - `-a`, `--address` \<address\> - Address, url or host name of new record **[required]**
        - `-q`, `--quiet`               - Disables the loading indicator **[optional]**
- `domain`
    - `list` - List all domains
        - `-t`, `--tld`   - Filter for a specific tld **[optional]**
        - `-s`, `--sort`  - Sort the list. Valid options are domein, registrant, admin, tech, verloopdatum or status **[optional]**
        - `-o`, `--order` - Specify in which order it should be shown (asc or desc) **[optional]**
        - `-b`, `--begin` - Show domain names starting with a letter of the alphabet, values: a-z or 0-9 **[optional]**
        - `-q`, `--quiet` - Disables the loading indicator **[optional]**
    - `record` - Get domain record data
        - `-f`, `--full-domain` - Instead of using `-d` and `-t` you can use this instead domain + tld `example.com` **[optional]**
        - `-d`, `--domain`      - Domain name **[optional]**
        - `-t`, `--tld`         - TLD extension of the domain name **[optional]**
        - `-i`, `--template-id` - Template ID **[optional]**
        - `-r`, `--type`        - Record type A, AAAA, TXT, MX..... (ALL to show all record types) **[required]**
        - `-h`, `--host`        - Record host **[optional]**
        - `-p`, `--property`    - Get a certain property e.g. id, type, host, address, priority, weight or port **[optional]**
        - `-q`, `--quiet`       - Disables the loading indicator and returns 0 instead of throwing an error when record not found **[optional]**
    - `template` - Get template id from domain
        - `-f`, `--full-domain` - Instead of using `-d` and `-t` you can use this instead domain + tld `example.com` **[optional]**
        - `-d`, `--domain`  - Domain name **[optional]**
        - `-t`, `--tld`     - TLD extension of the domain name **[optional]**
        - `-q`, `--quiet`       - Disables the loading indicator and returns 0 instead of throwing an error when record not found **[optional]**
- `get`
    - `apiPath`, `api-path`, `path`             - Get the current api path from the config file
    - `authType`, `auth-type`, `auth`           - Get the current auth type from the config file
    - `host`                                    - Get the current host from the config file
    - `lastNotif`, `last-notif`                 - Get the current lastNotification from the config file
    - `ssl`                                     - Get the current ssl value from the config file
    - `username`, `user`                        - Get the current username from the config file
- `set`
    - `apiPath`, `api-path`, `path`             - Update api path in the config file
    - `authType`, `auth-type`, `auth`           - Update auth type in the config file (plain or md5)
    - `host`                                    - Update host in the config file
    - `password`, `pwd`, `pw`, `pass`, `passwd` - Update the password in the config file
    - `ssl`                                     - Enable or disable ssl in the config file, when disabled auth type has to be md5
    - `username`, `user`                        - Update username in the config file
