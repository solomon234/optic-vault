#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
cp /optic-vault/database/optic-vault.db /optic-vault/backups/db_backup_$DATE.sqlite
find /optic-vault/backups -name "db_backup_*.sqlite" -mtime +7 -delete