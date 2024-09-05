const jwt = require('jsonwebtoken');
const User = require('../model/User');

const checkUser = (req , res , next) => {
    const token  = req.cookies.jwt; 
    if(token) {
        jwt.verify(token , 'This is my login token' , async(err , decocedToken) => {
            if(err){
                console.log(err.message);
                res.status(401).json(null);
                next();
            }
            else{
                let user = await User.findById(decocedToken.id);
                res.status(201).json({user});
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