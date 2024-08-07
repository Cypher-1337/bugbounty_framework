const express = require('express');
const cors = require('cors');
const domainRoute = require('./routes/domainRoute');
const aliveRoute = require('./routes/aliveRoute');
const subdomainsRoute = require('./routes/subdomainsRoute');
const monitorRoute = require('./routes/monitorRoute'); 
const downloadRoute = require('./routes/downloadRoute')
const fuzzRoute = require('./routes/fuzzRoute')
// require('./monitor/change_detection')
const http = require('http');



const app = express();
const server = http.createServer(app); // Create an HTTP server using Express app




app.use(cors({ origin: '*' }));
app.use(express.json());
 
app.use('/api/v1/domains', domainRoute);
app.use('/api/v1/alive', aliveRoute);
app.use('/api/v1/subdomains', subdomainsRoute);
app.use('/api/v1/monitor', monitorRoute); 
app.use('/api/v1/download', downloadRoute); 
app.use('/api/v1/fuzz', fuzzRoute); 




const port = 5000;

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

