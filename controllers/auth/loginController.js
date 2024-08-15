const connection = require("../../db/mysql")
const {createToken} = require("./JWT")

const login = async (req, res) => {
    try{

        let {username, password} = req.body

        connection.execute(
            `SELECT * FROM users WHERE username=? and password=?`,
            [username, password],
            function(err, results, field){
                if(err){
                    return res.status(500).json("Internal Server Error")
                }
                if(results.length === 0){
                    return res.status(401).json({Message: "Unathorized"})
                }
                if(results[0].is_verified == 0){
                    return res.status(401).json({Message: "Your Account is not verified yet"})

                }

                const accessToken = createToken(results[0])
                res.cookie("session", accessToken, {
                    maxAge: 60*60*24*3*1000   // session expires after 3 days
                })

                res.status(200).json({session: accessToken, user: results[0].username})
            }
        )

    }catch(err){
        res.status(500).json("Internal Server error")
    }
}

module.exports = {login}