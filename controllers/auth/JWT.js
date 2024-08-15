const {sign, verify} = require("jsonwebtoken")


const createToken = (user) =>{

    const accessToken = sign({username: user.username, id: user.id}, "jwtsecret1337")

    return accessToken
}

const validateToken = (req, res, next) => {

    const session = req.cookies["session"]
    if (!session)
        return res.status(401).json({Message: "Unathorized"})

    try{
        
        const validToken = verify(session, "jwtsecret1337")
        
        if(validToken) {
            req.authenticated = true
            return next()
        }else{
            return res.redirect('/login');

        }
        
    }catch(err){
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = {createToken, validateToken}