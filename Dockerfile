FROM node:20-alpine

# Install necessary packages
RUN apk add --no-cache \
    sqlite \
    python3 \
    cron \
    tzdata

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Create directory for SQLite database
RUN mkdir -p /app/optic-vault.db

# Add backup script
COPY backup-db.sh /app/scripts/backup-db.sh
RUN chmod +x /app/backup-db.sh

# Add crontab file
COPY crontab /etc/crontabs/root

# Build the application
RUN npm run build

# Expose the port your app runs on
EXPOSE 3000

# Start the application with the custom entrypoint
COPY scripts/docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
ENTRYPOINT ["docker-entrypoint.sh"]