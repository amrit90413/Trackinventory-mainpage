pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
        disableConcurrentBuilds()
        timeout(time: 20, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '20'))
    }

    parameters {
        booleanParam(name: 'DEPLOY', defaultValue: true, description: 'Deploy after building and checking the image. Use only one deployment job per container.')
        string(name: 'CONTAINER_NAME', defaultValue: 'trackinventory-mainpage', description: 'Landing-page container name; keep separate from the admin frontend.')
        string(name: 'HOST_PORT', defaultValue: '7003', description: 'Host HTTP port. Port 7002 is already used by the admin frontend.')
        choice(name: 'BIND_ADDRESS', choices: ['127.0.0.1', '0.0.0.0'], description: 'Use localhost for a host reverse proxy; choose all interfaces only when required.')
        string(name: 'DOCKER_NETWORK', defaultValue: 'trackinventory-net', description: 'Existing Docker network; leave empty to use Docker default networking.')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    def revision = sh(script: 'git rev-parse --short=12 HEAD', returnStdout: true).trim()
                    env.IMAGE_REF = "trackinventory-mainpage:${env.BUILD_NUMBER}-${revision}"
                }
            }
        }

        stage('Check agent') {
            steps {
                sh '''
                    set -eu
                    docker version
                    test -f package-lock.json
                    test -f Dockerfile
                '''
            }
        }

        stage('Build frontend image') {
            steps {
                sh '''
                    set -eu
                    docker build --pull \
                        --label "org.opencontainers.image.revision=$(git rev-parse HEAD)" \
                        --tag "$IMAGE_REF" .
                '''
            }
        }

        stage('Smoke test') {
            steps {
                sh 'sh ci/smoke-frontend.sh'
            }
        }

        stage('Deploy') {
            when {
                expression { params.DEPLOY }
            }
            steps {
                withEnv([
                    "CONTAINER_NAME=${params.CONTAINER_NAME}",
                    "HOST_PORT=${params.HOST_PORT}",
                    "BIND_ADDRESS=${params.BIND_ADDRESS}",
                    "DOCKER_NETWORK=${params.DOCKER_NETWORK}"
                ]) {
                    sh '''
                        set -eu
                        # Refuse deployment from feature branches or pull requests.
                        test "$(git rev-parse HEAD)" = "$(git rev-parse refs/remotes/origin/master)"
                        sh ci/deploy-frontend.sh
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "Frontend image built and checked: ${env.IMAGE_REF}. DEPLOY=${params.DEPLOY}"
        }
        failure {
            echo 'Frontend pipeline failed. Check the failed stage and any rollback messages in Console Output.'
        }
    }
}
