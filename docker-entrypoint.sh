#!/bin/sh
set -e

# Run command with node if the first argument contains a "-" or is not a system command. The last
# part inside the "{}" is a workaround for the following bug in ash/dash:
# https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=874264
if [ "${1#-}" != "${1}" ] || [ -z "$(command -v "${1}")" ] || { [ -f "${1}" ] && ! [ -x "${1}" ]; }; then
  set -- node "$@"
fi

## Update env.json
{
  echo "{"
  echo "  \"GRAPHQL_ENDPOINT\": \"${GRAPHQL_ENDPOINT}\","
  echo "  \"ACCESS_TOKEN_URL\": \"${ACCESS_TOKEN_URL}\","
  echo "  \"ACCESS_TOKEN_JSON_PATH\": \"${ACCESS_TOKEN_JSON_PATH}\""
  echo "}"
} > /app/dist/build/env.json

yarn start
#exec "$@"
