const jwt = require('jsonwebtoken')

function verifyToken(req, res, next) {
    jwt.verify(req.token, process.env.JWT_SIGN, (err, authData)=> {
        if(err){
            res.status(403).json({err:'authentication failed'})
        } else{
            next()
        }
    }) 
}

//before middleware, just in case:
    // jwt.verify(req.token, process.env.JWT_SIGN, (err, authData)=> {
    //     if(err){
    //         res.status(403).json({err:'authentication failed'})
    //     } else{
    //         res.send("you're in !!!")
    //     }
    // }) 

module.exports = verifyToken