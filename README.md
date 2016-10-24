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

Test:
"npm test" // This will turn on REDIS, dynamoDB and Express server concurrently (not meant for production) and run a full end to end test. This will only work in windows as that is the REDIS package I have added to this. For linux REDIS setup instructions go to https://www.digitalocean.com/community/tutorials/how-to-install-and-use-redis. NOTE: BE SURE TO BIND REDIS TO LOCALHOST (instructions included in link).




Start:
"npm start" // Starts REDIS, dynamoDB and Express only, no tests. (not meant for production, only windows. For linux install REDIS with instructions above)







Instructions for production:


Linux
export NODE_ENV=production
Windows
SET NODE_ENV=production


Install redis and connect dynamoDB and nGinx/Apache2 (forward port 8443 over HTTPS)

Setup your AWS Credentials:
Go to ./assets/AWSSecret.json and fill in your info. Only necessary in production the local DynamoDB store will accept any credentials and use the defaults if they are not real.

Set up logging


npm install pm2 -g && pm2 start server.js -i 4 // controls forking, restarting, scaling and load balancing for the one server. I can expand to more as needed.
                          
                          
