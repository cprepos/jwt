
# jwt
#LINUX JWT PROD SERVER INSTRUCTIONS

JWT authentication server using DynamoDB backend. 
API has a redis based rate limiter that only allows
100 requests per minute. 

Frontend handled with Angular 1.5.8. Communication 
is done using a $resource factory.

Assumptions:
-REDIS is installed on default port (Instructions: https://www.digitalocean.com/community/tutorials/how-to-install-and-use-redis)
-JAVA is installed (for dynamoDB local)
-If using non-GUI linux machine, Xvfb and xvfb-run are installed and working (for e2e tests to work) or another GUI emulator

Clone:
"git clone https://github.com/cprepos/jwt/ jwt"

install PM2:
(sudo) npm install -g pm2

Install:
"cd jwt && npm install"

Test server (IMPORTANT, IF NON-GUI ONLY, USE xvfb-run OTHERWISE e2e TESTS WILL FAIL):
if non-GUI Linux:"xvfb-run -a npm test" ; if GUI:"npm test". //This will concurrently start server/DynamoDB/tests. Not for production.

Production Environment
"export NODE_ENV=production"

Start Dynamo Server as service (this must be running with server:
"pm2 start DynamoLocalServer.js"

Start Production API server:
"pm2 start server.js -i 4"







