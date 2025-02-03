#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
cp /app/database/optic-vault.db /app/backups/db_backup_$DATE.sqlite
find /app/backups -name "db_backup_*.sqlite" -mtime +7 -delete