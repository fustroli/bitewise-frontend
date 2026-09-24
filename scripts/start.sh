#!/bin/bash
cd /home/ubuntu/bitewise-frontend
pm2 delete bitewise-frontend || true
pm2 start node_modules/next/dist/bin/next --name bitewise-frontend --node-args="--max-old-space-size=256" -- start -p 3000
pm2 save
