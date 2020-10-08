# mdr-cli
cli to interact with the mijndomeinreseller api

MijnDomeinReseller docs: https://pepijn98.github.io/mdr-cli/

# Usage
mdr \<subcommand\>

- `dns`
    - `details` - Get dns details from a domain
        - `-d`, `--domain` <domain>     - Domain name                     
        - `-t`, `--tld` <tld>           - TLD extension of the domain name
    - `modify`  - Modify dns records
        - `-d`, `--domain` \<domain\>   - Domain name                         
        - `-t`, `--tld` \<tld\>         - TLD extension of the domain name    
        - `-r`, `--record` \<record\>   - recordId of the record to be changed
        - `-h`, `--host` \<host\>       - Host name of the record             
        - `-a`, `--address` \<address\> - Address/url/host name of new record
- `domain`
    - `list` - List all domains
- `set`
    - `apiPath`, `path`                         - Update api path in config file                                                 
    - `authType`, `auth`                        - Update auth type in config file (plain or md5)                                 
    - `host`                                    - Update host in config file                                                     
    - `password`, `pwd`, `pw`, `pass`, `passwd` - Update the password in the config file                                         
    - `ssl`                                     - Enable or disable ssl in the config file, when disabled auth type has to be md5
    - `username`, `user`                        - Update the username in the config file
