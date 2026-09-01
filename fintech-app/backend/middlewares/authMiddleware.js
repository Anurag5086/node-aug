const jwt = require('jsonwebtoken')

const authMiddleware = async (req, res, next) => {
    try{
        const token = req.cookies.token

        if(!token){
            res.status(401).json({ success: false, message: "Token not provided!" })
        }
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        req.user = payload

        next()
    }catch(err){
        res.status(401).json({ success: false, message: "Invalid Token!" })
    }
}

module.exports = authMiddleware