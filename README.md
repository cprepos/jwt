# jwt

JWT authentication server using DynamoDB backend. 
API has a redis based rate limiter that only allows
100 requests per minute. 

Frontend handled with Angular 1.5.8. Communication 
is done using a $resource factory.


Clone:
"git clone https://github.com/cprepos/jwt/ jwt"


Install:
"cd jwt && npm install"

AWS Credentials:
Go to ./assets/AWSSecret.json and fill in your info, or email me and I'll send my credentials.

Test:
"npm test" // This will turn on REDIS, dynamoDB and Express server concurrently (not meant for production) and run a full end to end test 




Start:
"npm start" // Starts REDIS, dynamoDB and Express only, no tests. (not meant for production)







Instructions for production:


Linux
export NODE_ENV=production
Windows
SET NODE_ENV=production


Install redis and connect dynamoDB and nGinx/Apache2 (forward port 8443 over HTTPS)

Set up logging


npm install pm2 -g
pm2 start server.js -i 4 // controls forking, restarting, scaling and load balancing for the one server. I can expand to more as needed.
                          
                          
