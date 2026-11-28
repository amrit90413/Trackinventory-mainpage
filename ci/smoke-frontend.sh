#!/bin/sh
set -eu
: "${IMAGE_REF:?IMAGE_REF is required}"

docker run --rm --entrypoint nginx "$IMAGE_REF" -t
smoke_container=$(docker run --detach "$IMAGE_REF")
trap 'docker rm --force "$smoke_container" >/dev/null 2>&1 || true' EXIT
trap 'exit 130' INT
trap 'exit 143' HUP TERM

ready=false
for attempt in $(seq 1 30); do
    if docker exec "$smoke_container" wget -q -O /tmp/index.html http://127.0.0.1/; then
        ready=true
        break
    fi
    sleep 1
done
test "$ready" = true
docker exec "$smoke_container" sh -ec '
    grep -q "id=\"root\"" /tmp/index.html
    asset=$(grep -o "/assets/[^\"]*\\.js" /tmp/index.html | head -n 1)
    test -n "$asset"
    wget -q -O /tmp/app.js "http://127.0.0.1$asset"
    test -s /tmp/app.js
    wget -q -O /tmp/route.html http://127.0.0.1/business-details
    grep -q "3560978907394960" /tmp/index.html
    grep -q "id=\"root\"" /tmp/route.html
    if grep -q "3560978907394960" /tmp/route.html; then exit 1; fi
'
