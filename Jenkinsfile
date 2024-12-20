pipeline  { 
        
       agent any

       stages {

         
        stage('Build Frontend') {
            steps {
                script {
                    // Charger la version depuis le fichier
                    def backendVersion = readFile('/usr/local/tomcat9/version.txt').trim()
                    echo "${backendVersion}"
                    def jenkinsUrl = env.JENKINS_URL
                    echo "L'adresse du serveur Jenkins est : ${jenkinsUrl}"
                     // Extraire l'URL sans le port
                    def urlWithoutPort = jenkinsUrl.replaceAll(/:\d+/, '')
                    def urlApp = urlWithoutPort.substring(0, urlWithoutPort.lastIndexOf('/'))
                    echo "L'adresse du serveur Jenkins est : ${urlApp}"
                    // Utiliser la version dans le fichier env.ts
               writeFile file: 'src/environments/environment.development.ts', text: "export const environment = { apiback:'${urlApp}:8080/projet_mapping_${backendVersion}' };"
                }
            }
        }
   

        stage('Deploy dist angular') {
            steps {
            nodejs('node') {
              sh 'npm install'
              sh 'ng build'

                }
            }
        }

         stage('Deploy') {
            steps {
              script {

              def number = currentBuild.number
              def version = "1.0.${number}"
              sh "cp -R dist/* /usr/local/tomcat9/webapps/mapping-front-${version}"
              
            }
        }

         }

          stage('Stop Tomcat') {
            steps {
                  
                  sh '/usr/local/tomcat9/bin/shutdown.sh'
                  sleep time: 120
                  }
            }
         
         stage('Start Tomcat') {
            steps {  
                  keepRunning {
                  sh '/usr/local/tomcat9/bin/startup.sh'
                  sleep time: 120            
                  }                    
        }
         }




        } 
   
        
}
