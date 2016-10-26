//Child process
var child = require('child_process');
child.exec("cd DynamoDB && java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb -port 8001",function(err, stderr, stdin){
    console.log('started');
})