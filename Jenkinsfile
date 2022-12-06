pipeline {
     agent any
     stages {
		stage ("kill current screens"){
			steps{
				sh "sudo pkill screen"
			}
		}
        stage("Build") {
            steps {
                sh "sudo npm install"
				sh "sudo ts-node deployCommands.ts"
            }
        }
        stage("Deploy") {
            steps {
                sh "sudo screen -S bot npm start"
            }
        }
    }
}