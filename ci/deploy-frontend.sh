#!/bin/sh
set -eu

: "${IMAGE_REF:?IMAGE_REF is required}"
: "${CONTAINER_NAME:?CONTAINER_NAME is required}"
: "${HOST_PORT:?HOST_PORT is required}"
: "${BIND_ADDRESS:?BIND_ADDRESS is required}"
DOCKER_NETWORK=${DOCKER_NETWORK:-}

printf '%s\n' "$CONTAINER_NAME" | grep -Eq '^[a-zA-Z0-9][a-zA-Z0-9_.-]*$' || {
    echo 'Invalid container name.' >&2
    exit 1
}
case "$HOST_PORT" in ''|*[!0-9]*) echo 'HOST_PORT must be numeric.' >&2; exit 1 ;; esac
test "$HOST_PORT" -ge 1 && test "$HOST_PORT" -le 65535 || {
    echo 'HOST_PORT must be between 1 and 65535.' >&2
    exit 1
}
case "$BIND_ADDRESS" in 127.0.0.1|0.0.0.0) ;; *) echo 'Unsupported bind address.' >&2; exit 1 ;; esac

docker image inspect "$IMAGE_REF" >/dev/null
if [ -n "$DOCKER_NETWORK" ]; then
    docker network inspect "$DOCKER_NETWORK" >/dev/null
fi

backup="${CONTAINER_NAME}-previous-${BUILD_NUMBER:-manual}"
if docker container inspect "$backup" >/dev/null 2>&1; then
    echo "Backup container already exists: $backup. Resolve it before deploying." >&2
    exit 1
fi

previous_saved=false
previous_running=false
replacement_attempted=false

rollback_on_failure() {
    result=$?
    trap - EXIT HUP INT TERM
    if [ "$result" -ne 0 ]; then
        echo 'Deployment failed; restoring the previous container when available.' >&2
        if [ "$replacement_attempted" = true ]; then
            docker logs --tail 50 "$CONTAINER_NAME" >&2 || true
            docker rm --force "$CONTAINER_NAME" >/dev/null 2>&1 || true
        fi
        if [ "$previous_saved" = true ]; then
            if docker rename "$backup" "$CONTAINER_NAME"; then
                if [ "$previous_running" = true ]; then
                    docker start "$CONTAINER_NAME" >/dev/null || echo 'ROLLBACK FAILED: could not start previous container.' >&2
                fi
            else
                echo "ROLLBACK FAILED: previous container remains at $backup." >&2
            fi
        fi
    fi
    exit "$result"
}
trap rollback_on_failure EXIT
trap 'exit 130' INT
trap 'exit 143' HUP TERM

if docker container inspect "$CONTAINER_NAME" >/dev/null 2>&1; then
    previous_running=$(docker inspect --format '{{.State.Running}}' "$CONTAINER_NAME")
    docker rename "$CONTAINER_NAME" "$backup"
    previous_saved=true
    docker stop "$backup" >/dev/null
fi

set -- docker run --detach --name "$CONTAINER_NAME" --restart unless-stopped \
    --publish "$BIND_ADDRESS:$HOST_PORT:80"
if [ -n "$DOCKER_NETWORK" ]; then
    set -- "$@" --network "$DOCKER_NETWORK"
fi
replacement_attempted=true
"$@" "$IMAGE_REF"

ready=false
for attempt in $(seq 1 30); do
    if docker exec "$CONTAINER_NAME" wget -q -O - http://127.0.0.1/ | grep -q 'id="root"'; then
        ready=true
        break
    fi
    sleep 1
done
test "$ready" = true

trap - EXIT HUP INT TERM
if [ "$previous_saved" = true ]; then
    docker rm "$backup" >/dev/null || echo "Deployed successfully, but could not remove old container $backup." >&2
fi
echo "Landing page deployed: $CONTAINER_NAME ($IMAGE_REF), listening on $BIND_ADDRESS:$HOST_PORT."
