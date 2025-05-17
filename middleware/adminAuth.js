const Admin  =  require('../model/Admin');
const jwt = require('jsonwebtoken')

const adminAuth = (req , res , next) => {
    const token  = req.cookies.admin_jwt;
    if(token) {
        jwt.verify(token , process.env.ADMIN_LOGIN_TOKEN , async(err , decodedToken) => {
            if(err){
                console.log(err.message);
                res.status(401).json("Please Login Again");
                next();
            }
            else{
                let user = await Admin.findById(decodedToken.id);
                res.status(201).json("Success as Admin");
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

module.exports = {adminAuth};