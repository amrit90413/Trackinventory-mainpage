# Jenkins frontend deployment

This pipeline builds and deploys **Trackinventory-mainpage** separately from the
TrackInventory API and its admin frontend.

## Configure the Jenkins job

1. Create a **Pipeline** job and select **Pipeline script from SCM**.
2. Select **Git** and repository `https://github.com/amrit90413/Trackinventory-mainpage.git`.
3. Set the branch specifier to `*/master` and Script Path to `Jenkinsfile`.
4. Use a Linux agent with Git, a POSIX shell, and Docker CLI/daemon access. The
   Docker daemon must be on the intended deployment server. Node.js and npm run
   inside the existing Dockerfile; they are not required on the agent.
5. Save and select **Build Now**. Subsequent runs offer **Build with Parameters**.

Use one deployment job for this container on a stable deployment agent. The file
uses `agent any`, matching the existing backend pipeline. If Jenkins has agents on
different servers, replace it with `agent { label 'your-deployment-server' }` using
the label of the intended server before running this deployment job.

## Parameters

| Parameter | Default | Meaning |
| --- | --- | --- |
| `DEPLOY` | `true` | Build, check and deploy; set false for build/check only |
| `CONTAINER_NAME` | `trackinventory-mainpage` | Separate landing-page container |
| `HOST_PORT` | `7003` | Host port; the existing admin frontend already uses `7002` |
| `BIND_ADDRESS` | `127.0.0.1` | Host reverse proxy can reach the site locally |
| `DOCKER_NETWORK` | `trackinventory-net` | Existing shared network; empty uses Docker defaults |

The shared network must already exist when selected. Check with
`docker network inspect trackinventory-net`. If it does not exist, create it once
with `docker network create trackinventory-net` or leave the parameter empty.

Configure the existing domain reverse proxy to send landing-page requests to
`http://127.0.0.1:7003` on the Docker host. A reverse proxy container on the shared
network can use `http://trackinventory-mainpage:80` instead. The pipeline does not
change DNS, TLS certificates or the existing proxy configuration.

## Build and deployment behavior

The pipeline checks out SCM, builds the Dockerfile (including `npm ci` and
`npm run build`), validates nginx configuration, and starts a temporary container.
It checks the HTML root, a generated JavaScript asset, and a client-side route.
It deploys only if the checked-out commit matches `origin/master`.

Only after those checks does deployment briefly stop the current landing container.
The previous container is retained until the replacement answers an HTTP check;
startup or check failures trigger rollback. There is a brief interruption during
replacement. Agent loss, Docker daemon failure, or a forced process kill can prevent
automatic rollback, so inspect the `-previous-<build>` container if a run is interrupted.

Concurrency is disabled for this job. Build logs are retained for 20 runs. Images
use a build-number/commit tag; the pipeline does not prune images from other jobs.

After deploying the backend and frontend, business cards stay hidden unless the
active KVS key `landing_business_directory_enabled` is set to `true`.

Jenkins reference: https://www.jenkins.io/doc/book/pipeline/syntax/
