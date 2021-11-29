#!/bin/bash

if [ -z "$1" ]
  then
    echo "No argument supplied"
    exit -1
fi
cp src/config.prod.json src/config.json
npm run build
git add -A
git commit -m "${1}"
git push