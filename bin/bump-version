#!/bin/bash
set -e

update_version() {
    if [[ "$DONT_BUMP_VERSION" -ne "1" ]]
    then
        echo " Bumping version.. "
    else
        echo "Version will not be bumped since variable DONT_BUMP_VERSION is set."
        exit 0
    fi

    old_version=`cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[\",]//g' | tr -d '[[:space:]]'`

    # split version (1, 0, 0-dev32)
    version_split=( ${old_version//./ } )

    # get tag from version (-dev32)
    version_tag=( ${version_split[2]//-/ } )

    case $1 in
        "tag")
            # get version num from tag
            version_tag_name=( ${version_tag[1]//[!a-zA-Z]/} )
            version_tag_num=( ${version_tag[1]//[!0-9]/} )

            if [[ -z "$version_tag_name" ]]
            then
                version_tag_name="build"
            fi

            # increment the dev version
            ((++version_tag_num))
            new_version="${version_split[0]}.${version_split[1]}.${version_tag[0]}-${version_tag_name}${version_tag_num}"
            ;;
        "patch")
            # increment the number at the 3rd position ( 0,1,2 )
            ((++version_tag[0]))

            if [[ ! -z "${version_tag[1]}" ]]
            then
                version_tag_name=( ${version_tag[1]//[!a-zA-Z]/} )
                old_tag="-${version_tag_name}0"
            else
                old_tag=""
            fi

            new_version="${version_split[0]}.${version_split[1]}.${version_tag[0]}${old_tag}"
            ;;
        "minor")
            # increment the number at the 2nd position ( 0,1,2 )
            ((++version_split[1]))

            if [[ ! -z "${version_tag[1]}" ]]
            then
                version_tag_name=( ${version_tag[1]//[!a-zA-Z]/} )
                old_tag="-${version_tag_name}0"
            else
                old_tag=""
            fi

            new_version="${version_split[0]}.${version_split[1]}.0${old_tag}"
            ;;
        "major")
            # increment the number at the 1st position ( 0,1,2 )
            ((++version_split[0]))

            if [[ ! -z "${version_tag[1]}" ]]
            then
                version_tag_name=( ${version_tag[1]//[!a-zA-Z]/} )
                old_tag="-${version_tag_name}0"
            else
                old_tag=""
            fi

            new_version="${version_split[0]}.0.0${old_tag}"
            ;;
    esac

    # overwrite it in the package.json file
    sed -i -e "0,/$old_version/s/$old_version/$new_version/" package.json
}

# show off the old version
echo $(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[[:space:]]')

update_version $1

# show off the updated version
echo $(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[[:space:]]')

# track the change
git add package.json
