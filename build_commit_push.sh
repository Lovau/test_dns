#!/bin/bash

if [ -z "$1" ]
  then
    echo "No argument supplied"
    exit -1
fi

npm run build
git add -A
git commit -m "${1}"
git push