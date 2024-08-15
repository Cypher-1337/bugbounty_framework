const connection = require ("../../db/mysql")



const registerNewUser = async (req, res) =>{
    try{
        let {username, email, password} = req.body


        connection.execute(
            `INSERT INTO users(username,email,password) values(?, ?, ?)`, 
            [username, email, password],
            function(err, results, fields){ 
                if(err){
                    if(err.code == "ER_DUP_ENTRY"){
                        return res.status(409).json({ message: "Username or email already exists" });
                    }
                }

                res.status(200).json({"username": username, "email": email})
            }
        );



    }catch (error){
        res.status(500).json({"Error": "Registering User"})
    }
}


module.exports = {registerNewUser}