const express = require('express');
const cors = require('cors');
const domainRoute = require('./routes/domainRoute')
const aliveRoute = require('./routes/aliveRoute')
const subdomainsRoute = require('./routes/subdomainsRoute')
const app = express();


app.use(cors({ origin: '*' }));
app.use(express.json())


app.use('/api/v1/domains', domainRoute)
app.use('/api/v1/alive', aliveRoute)
app.use('/api/v1/subdomains', subdomainsRoute)



const start = async () => {
  try {
    
    // await connectDB()
    
    
    app.listen(5000, () => {
      console.log(`Server is running on http://localhost:5000`);
    });

  }
  

  catch (error) {
      console.error("Can't Start the server")
  }

}

start()