const fs = require('fs');
const path = require('path');


const displayFuzzing = async (req, res) => {

    const url = req.query.url
    const parsedUrl = new URL(url);
    let fileContent = ''

    const savedFile = path.join('/root/monitor/fuzz', parsedUrl.hostname, 'results.txt');
    
    try{
       fileContent = getFileContent(savedFile)
       res.status(200).json({ "fileContent": fileContent });
    }catch(err){
        res.status(500).json({Error: err.message})

    }


}

function getFileContent(file) {
    if (!fs.existsSync(file)) {
      throw new Error("File not found");
    }
    return fs.readFileSync(file, 'utf8');
  }

  

module.exports = {displayFuzzing}
 