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
                sh "pm2 start index.ts || pm2 restart index.ts"
            }
        }
    }
}