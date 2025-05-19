const jwt = require('jsonwebtoken');
const User = require('../model/User');

const checkUser = (req , res , next) => {
    const token  = req.cookies.jwt;
    if(token) {
        jwt.verify(token , process.env.LOGIN_TOKEN , async(err , decodedToken) => {
            if(err){
                res.status(401).json("Please Login Again");
                next();
            }
            else{
                let user = await User.findById(decodedToken.id);
                res.status(201).json("Success");
                next();
            }
        })
    }
    else 
    {
        res.status(401).json(null);
        next();
    }
}

module.exports = {checkUser};