#!/bin/bash

# Use this script to update the server with the latest from the develop branch.
# Your current directory must be the scripts folder when you run the script.

if [ "$#" -ne 1 ]; then
  echo "Error: Server username and address required"
  echo "Example: ./update-client.sh ubuntu@server.com"
  exit 1
fi

SERVER_ADDRESS="$1"

echo "Changing directory to project root"
cd ..

echo "Pulling latest code from develop branch"
git checkout develop
git pull

npm ci
if [ $? -ne 0 ]; then
  echo "Error running 'npm ci'. Aborting update."
  exit 1
fi

npm run build-prod
if [ $? -ne 0 ]; then
  echo "Error running 'npm run build-prod'. Aborting update."
  exit 1
fi

echo "Changing directory to dist"
cd dist

echo "Creating en-US.tar.gz"
tar -czf en-US.tar.gz en-US

echo "Copying en-US.tar.gz to server"
scp en-US.tar.gz $SERVER_ADDRESS:./

echo "Running deploy-client.sh script on server"
ssh $SERVER_ADDRESS "sudo ~/scripts/deploy-client.sh"

