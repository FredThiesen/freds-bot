pipeline {
    agent any
    stages {
        stage("Clean") {
            steps {
                sh "sudo rm -rf node_modules"
				sh "sudo rm -rf /home/ubuntu/.npm/_cacache"
            }
        }
        stage("Copy Config") {
            steps {
                sh "cp /var/lib/jenkins/config.json ./"
            }
        }
        stage("Build") {
            steps {
                sh "npm install"
                sh "ts-node deployCommands.ts"
            }
        }
        stage("Deploy") {
            steps {
                sh "sudo pm2 delete bot || true" // Ignore error if bot doesn't exist
                sh "sudo pm2 start index.ts --watch --exp-backoff-restart-delay=1000 --restart-delay=3000 --name bot"
                sh "sudo pm2 status bot"
            }
}
    }
}