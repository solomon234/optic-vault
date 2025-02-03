#!/bin/sh
# Start cron daemon
crond

# Initialize database if it doesn't exist
if [ ! -f /app/database/optic-vault.db ]; then
echo "Initializing database..."
sqlite3 /app/database/optic-vault.db < /app/init.sql
fi

# Start the Nuxt application
exec node .output/server/index.mjs

# crontab
# Run backup daily at 2 AM
0 2 * * * /app/backup-db.sh