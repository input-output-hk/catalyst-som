#!/usr/bin/env bash

# ---------------------------------------------------------------
# Entrypoint script for webapp variables setup.
# ---------------------------------------------------------------
#
# This script serves as the entrypoint to set the variables necessary to run 
# the webapp. It populates the `env.js` file in the bundle using the values
# from the environment variables.
#
# It expects the following environment variables to be set except where noted:
# VITE_SUPABASE_URL - The URL of the Supabase database
# VITE_SUPABASE_ANON_KEY - The API key of the Supabase database
# VITE_LOCAL_BASEURL - The base URL of the webapp
# VITE_MAX_MILESTONE_BUDGET - The maximum budget for a milestone
#
# ---------------------------------------------------------------
set +x
set -o errexit
set -o pipefail
set -o nounset
set -o functrace
set -o errtrace
set -o monitor
set -o posix
shopt -s dotglob

check_env_vars() {
    local env_vars=("$@")

    # Iterate over the array and check if each variable is set
    for var in "${env_vars[@]}"; do
        echo "Checking $var"
        if [ -z "${!var+x}" ]; then
            echo ">>> Error: $var is required and not set."
            exit 1
        fi
    done
}

debug_sleep() {
    if [ -n "${DEBUG_SLEEP:-}" ]; then
        echo "DEBUG_SLEEP is set. Sleeping for ${DEBUG_SLEEP} seconds..."
        sleep "${DEBUG_SLEEP}"
    fi
}

echo ">>> Starting entrypoint script..."

# Check if all required environment variables are set
REQUIRED_ENV=(
    "VITE_SUPABASE_URL"
    "VITE_SUPABASE_ANON_KEY"
    "VITE_LOCAL_BASEURL"
    "VITE_MAX_MILESTONE_BUDGET"
)
check_env_vars "${REQUIRED_ENV[@]}"

# Sleep if DEBUG_SLEEP is set
debug_sleep

# Run migrations
echo ">>> Set local env file..."

while IFS= read -r -d '' file; do
    echo "Setting env to $file"
    echo "window.env = {" > $file
    for var in "${REQUIRED_ENV[@]}"; do
        echo "\"$var\": \"${!var}\"," >> $file
    done
    echo "}" >> $file
done < <(find ./app/ -name 'env.js' -print0 | sort -z)

echo ">>> Finished entrypoint script"
