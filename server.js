const express = require('express');
const cors = require('cors');

const cookieParser = require("cookie-parser")
const {validateToken, checkAdmin} = require("./controllers/auth/JWT")
const domainRoute = require('./routes/domainRoute');
const aliveRoute = require('./routes/aliveRoute');
const subdomainsRoute = require('./routes/subdomainsRoute');
const monitorRoute = require('./routes/monitorRoute'); 
const downloadRoute = require('./routes/downloadRoute')
const loginRoute = require('./routes/auth/loginRoute')
const checkRoute = require('./routes/auth/checkRoute')
const changesRoute = require('./routes/changesRoute')
const testingRoute = require('./routes/testRoute')

const http = require('http');



const app = express();
const server = http.createServer(app); // Create an HTTP server using Express app




app.use(cors({ origin: '*',credentials: true }));
app.use(express.json());
app.use(cookieParser()) 

app.use('/api/v1/auth/login', loginRoute)
app.use('/api/v1/auth/check', checkRoute)

// Apply validateToken middleware to all routes after the above exclusions
app.use(validateToken);

app.use('/api/v1/domains', domainRoute);
app.use('/api/v1/alive', aliveRoute);
app.use('/api/v1/subdomains', subdomainsRoute);
app.use('/api/v1/monitor', validateToken, checkAdmin, monitorRoute); 
app.use('/api/v1/download', downloadRoute); 
app.use('/api/v1/changes', changesRoute )
app.use('/api/v1/testing', testingRoute)

const port = 5000;

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

