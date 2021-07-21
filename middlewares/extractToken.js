function extractToken(req, res, next) {
    //Get auth header value
    const bearerHeader = req.headers['authorization']

    //check if bearer is undefined
    if(typeof bearerHeader !== 'undefined'){
        //Split at the space
        const bearer = bearerHeader.split(' ')
        const bearerToken = bearer[1]

        req.token = bearerToken

        next()
    } else{
        res.status(403).json({err:'authentication failed'})
    }
}

module.exports = extractToken