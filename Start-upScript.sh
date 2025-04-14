DB_PATH="./database"

apt-get install gnupg curl

curl -fsSL https://www.mongodb.org/static/pgp/server-8.0.asc | \
    gpg -o /usr/share/keyrings/mongodb-server-8.0.gpg \
   --dearmor

echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] https://repo.mongodb.org/apt/ubuntu noble/mongodb-org/8.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-8.0.list

apt-get update
apt-get install -y mongodb-org

systemctl start mongod
systemctl status mongod

curl -fsSL https://deb.nodesource.com/setup_lts.x | -E bash -
sudo apt install -y nodejs

if [ ! -d "$DB_PATH" ]; then
  echo "Creating MongoDB data directory at $DB_PATH"
  mkdir -p "$DB_PATH"
fi

echo "Starting MongoDB..."
mongod --dbpath "$DB_PATH" --fork --logpath "$LOG_PATH"
echo "MongoDB started."

echo "Installing Node.js packages..."
npm install

node index.js