pipeline {
     agent any
     stages {
		// stage("kill current screens"){
		// 	steps{
		// 		sh "pkill screen"
		// 	}
		// }
        stage("Build") {
            steps {
                sh "npm install"
				sh "ts-node deployCommands.ts"
            }
        }
        stage("Deploy") {
            steps {
                sh "screen -S bot npm start"
            }
        }
    }
}