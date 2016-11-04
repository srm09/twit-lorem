#!/bin/bash

echo "Starting redis-server"
service redis-server start

echo "Starting nodejs server"
cd src && npm start
