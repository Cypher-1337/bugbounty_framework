const fs = require('fs');
const path = require('path');


const getdata = async (req, res) => {
    try {
        res.setHeader('Content-Type', 'application/x-ndjson');

        
        dirPath = path.join("/", "home", "kali", "dorking")
        filePath = path.join(dirPath, 'search_results.txt')

        const urlStream = fs.createReadStream(filePath, {encoding: 'utf8'})

        urlStream.on("data", (data) => {
            res.write(data)
        } )

        urlStream.on("error", (err) => {
            console.error(err)
        })

        urlStream.on('end', () => {
            res.end()
        })


    } catch (error) {
        res.status(500).json({ error: `Unable to read directories: ${error.message}` });
    }
};

module.exports = {getdata}