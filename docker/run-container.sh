echo "window.env = " > ./dist/public/env.js
jq -n --argfile vars allowed_env_vars.json 'env | with_entries(select(.key | IN($vars[])))' >> ./dist/public/env.js

sed -i -E "s/env\.js(\?v=\d*)?/env.js?v=$(date +%s%N)/g" ./dist/public/index.html

npm run db:push
npm run serve
