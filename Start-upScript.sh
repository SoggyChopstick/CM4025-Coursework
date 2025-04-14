#!/bin/bash

DB_PATH="./database"

apt-get install gnupg curl

curl -fsSL https://deb.nodesource.com/setup_18.x | bash -

apt install -y nodejs

curl -fsSL https://www.mongodb.org/static/pgp/server-8.0.asc | \
    gpg -o /usr/share/keyrings/mongodb-server-8.0.gpg \
   --dearmor

echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] https://repo.mongodb.org/apt/ubuntu noble/mongodb-org/8.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-8.0.list

apt-get update
apt-get install -y mongodb-org

systemctl start mongod

curl -fsSL https://deb.nodesource.com/setup_lts.x | -E bash -
sudo apt install -y nodejs

echo "Starting MongoDB..."
mongod --fork --auth --port 27017 --dbpath "$DB_PATH"
echo "MongoDB started."

echo "Installing Node.js packages..."
npm install

node index.js