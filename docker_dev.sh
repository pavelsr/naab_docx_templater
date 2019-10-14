#!/usr/bin/env bash
docker run -d -p 3000:80 -v $(pwd):/usr/share/nginx/html nginx:alpine
