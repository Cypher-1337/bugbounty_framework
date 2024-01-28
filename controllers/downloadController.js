const {join} = require('path')

const getFile = (req, res) => {
    try {

        const filePath = req.query.file

        // Check if the file path is provided
        if(!filePath){
                return res.status(400).json({ error: "File Path not provided!"})
        }

        res.download(filePath, (err) =>{
            if (err) {
                // Handle errors (e.g., file not found)
                return res.status(404).json({ error: 'File not found' });
            }
        })
        
    }catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}



module.exports = {getFile}
