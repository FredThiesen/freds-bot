pipeline {
     agent any
     stages {
        stage("Build") {
            steps {
                sh "npm install"
				sh "ts-node deployCommands.ts"
            }
        }
        stage("Deploy") {
            steps {
                sh "sudo pm2 start index.ts --watch --exp-backoff-restart-delay=1000 || sudo pm2 restart index.ts --watch --exp-backoff-restart-delay=1000"
            }
        }
    }
}