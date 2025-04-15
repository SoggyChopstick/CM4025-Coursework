#!/bin/bash

DB_PATH="./database"

# Install dependencies
apt-get update
apt-get install -y gnupg curl

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Add MongoDB repo and install
curl -fsSL https://www.mongodb.org/static/pgp/server-8.0.asc | \
    gpg -o /usr/share/keyrings/mongodb-server-8.0.gpg --dearmor

echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] https://repo.mongodb.org/apt/ubuntu noble/mongodb-org/8.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-8.0.list

apt-get update
apt-get install -y mongodb-org

# Create DB directory if needed
if [ ! -d "$DB_PATH" ]; then
  mkdir -p "$DB_PATH"
fi

# Start MongoDB temporarily without auth
echo "Starting MongoDB without auth to create admin user..."
mongod --fork --port 27017 --dbpath "$DB_PATH" --logpath ./data/mongod.log

# Give it a moment to start
sleep 5

# Create admin user using mongo shell
echo "Creating admin user..."
mongosh <<EOF
use admin
db.createUser({
  user: "databaseAdmin",
  pwd: "password",
  roles: [ { role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase" ]
})
EOF

# Stop temporary MongoDB instance
mongod --dbpath "$DB_PATH" --shutdown

# Restart MongoDB with auth
echo "Restarting MongoDB with authentication enabled..."
mongod --fork --auth --port 27017 --dbpath "$DB_PATH" --logpath ./data/mongod.log
echo "MongoDB started with auth."

# Install Node packages
echo "Installing Node.js packages..."
npm install

# Start the Node.js app
node index.js
