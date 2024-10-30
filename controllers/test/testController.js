const { error } = require('console')
const fs = require('fs')
const path = require('path')


const fileWriting = async () => {

    try {
        
        const basePath = path.join(process.cwd(), "controllers", "test")
        const domainPath = path.join(basePath, "urls.txt")
        const outputPath = path.join(basePath, "results.txt")
        
        const streamUrls = fs.createWriteStream(outputPath, {encoding: "utf8"})

        for (let i =0 ; i<= 10000000 ; i++){
            streamUrls.write(`log number ${i}\n`)
        }

        streamUrls.on("end", () => {
            console.log("writed successsfully")
        })

        streamUrls.on("error", (err) => {
            console.error(err)
        })

        return 'jjj'
        
    } catch (error) {
        console.log('errorrrrrr' + error)
    }
}

const testing = async (req, res) => {
    try {
        const f = await fileWriting()
        res.status(200).json({"testing": f })
    } catch (error) {
        console.log("error")
    }
}



module.exports = {testing}