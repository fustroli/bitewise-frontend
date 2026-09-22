#!/bin/bash
for i in $(seq 1 10); do
  curl -sf http://localhost:3000 -o /dev/null && exit 0
  sleep 3
done
exit 1
