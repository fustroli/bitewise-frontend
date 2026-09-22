#!/bin/bash
cd /home/ubuntu/bitewise-frontend
pm2 start npm --name bitewise-frontend -- start || pm2 restart bitewise-frontend
