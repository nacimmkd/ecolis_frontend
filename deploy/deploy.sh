#!/usr/bin/env bash

# deploying new version
# use : deploy.sh <git-sha>

set -e
cd "$(dirname "$0")"

TAG=$1
PREVIOUS=$(grep '^TAG=' .env | cut -d= -f2)

sed -i "s/^TAG=.*/TAG=$TAG/" .env
docker compose pull frontend-app

# rollback if something went wrong
if ! docker compose up -d --wait frontend-app; then
  echo "FAILED, rolling back to $PREVIOUS"
  sed -i "s/^TAG=.*/TAG=$PREVIOUS/" .env
  docker compose up -d --wait frontend-app
  exit 1
fi

echo "RUNNING VERSION : $TAG"