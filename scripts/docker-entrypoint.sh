#!/bin/sh
# Start cron daemon
crond

# Initialize database if it doesn't exist
if [ ! -f /optic-vault/database/optic-vault.db ]; then
echo "Initializing database..."
sqlite3 /optic-vault/database/optic-vault.db < /optic-vault/scripts/init.sql
fi

rm -rf /optic-vault/.output/server/node_modules

# Start the Nuxt application
npm run start

# crontab
# Run backup daily at 2 AM
0 2 * * * /optic-vault/scripts/backup-db.sh