#!/usr/bin/env bash

if ! command -v expect &> /dev/null; then
    echo "Error: 'expect' is not installed. Please install it and try again."
    exit 1
fi

ENV_FILE="../.env.production"

if [ ! -f "$ENV_FILE" ]; then
    echo "Error: $ENV_FILE file not found!"
    exit 1
fi

set_secret() {
    local key=$1
    local value=$2
    
    value=$(printf '%s' "$value" | sed -e 's/[]\/$*.^[]/\\&/g' -e 's/\[/\\\[/g' -e 's/\]/\\\]/g')
    
    expect -c "
    set timeout -1
    log_user 0
    spawn firebase apphosting:secrets:set $key
    expect \"Enter a value for $key\"
    send -- \"$value\r\"
    expect {
        \"Would you like to grant access now?\" {
            send \"Y\r\"
            exp_continue
        }
        \"Would you like to add this secret to apphosting.yaml?\" {
            send \"Y\r\"
            exp_continue
        }
        eof
    }
    "
}

{
    while IFS= read -r line || [[ -n "$line" ]]; do
        if [[ -z "$line" ]] || [[ "$line" =~ ^# ]]; then
            continue
        fi

        if [[ $line =~ ^([^=]+)=(.*)$ ]]; then
            key=${BASH_REMATCH[1]}
            value=${BASH_REMATCH[2]}
            
            key=$(echo "$key" | xargs)
            
            if [[ $value =~ ^\'.*$ && ! $value =~ .*\'$ ]]; then
                while IFS= read -r nextline && [[ ! $nextline =~ .*\'$ ]]; do
                    value+=$'\n'$nextline
                done
                value+=$'\n'$nextline
            fi

            value="${value#\'}"
            value="${value%\'}"
        else
            echo "Invalid line format: $line"
            continue
        fi

        echo "Setting secret: $key"
        set_secret "$key" "$value"
        echo "Secret $key has been set."
    done
} < "$ENV_FILE"

echo "All secrets have been uploaded!"