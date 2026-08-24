#!/bin/sh

set -e

TEXT="algotiqa:8443"

if [ -n "$ALGO_TEXT" ]; then
  TEXT="$ALGO_TEXT"
fi

if [ -n "$ALGO_HOST" ]; then
    echo "Substituting: '$TEXT' with '$ALGO_HOST'"
    sed -i "s|$TEXT|$ALGO_HOST|g" /usr/share/nginx/html/main-*.js
fi

# Execute NGINX
exec "$@"
