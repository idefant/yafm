#!/bin/sh
set -e

: "${DB_HOSTNAME:?Missing DB_HOSTNAME}"

./wait-for-it.sh "$DB_HOSTNAME" --timeout=30 --strict -- echo "✅ Postgres is up"

echo "window.env = " > ./dist/public/env.js
jq -n --argfile vars allowed_env_vars_frontend.json 'env | with_entries(select(.key | IN($vars[])))' >> ./dist/public/env.js

sed -i -E "s/env\.js(\?v=\d*)?/env.js?v=$(date +%s%N)/g" ./dist/public/index.html

npm run db:push
npm run serve
