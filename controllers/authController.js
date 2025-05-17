const Admin = require('../model/Admin');
const User = require('../model/User');
const jwt = require('jsonwebtoken')

const handelError = (err) => {
    console.log(err.message , err.code)

    let errors = { email: '' , password: ''}

    if (err.code === 11000) {
        errors.email = "Email is already registered";
        return errors;
    }


    if (err.message.includes("user validation failed")) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        });
    }

    if(err.message === 'Incorrect Password'){
        errors.password = 'Incorrect Password'
        return errors;
    }
    if(err.message === 'Incorrect Email')
    errors.email = 'Email is not registered'
    return errors;
}

const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
    return jwt.sign({ id } , process.env.LOGIN_TOKEN , {
        expiresIn: maxAge
    });
}

const createAdminToken = (id) => {
    return jwt.sign({ id } , process.env.ADMIN_LOGIN_TOKEN , {
        expiresIn: maxAge
    });
}

module.exports.signup = async (req , res ) => {
    const {fname , lname , email , password} = req.body;

    try {
        const user = await User.create( {fname, lname , email, password});
        const token = createToken(user._id);
        res.cookie('jwt' , token , {httpOnly: true , maxAge: maxAge * 1000})
        res.status(201).json({user: user._id});
    }
    catch(err){
        const errors = handelError(err);
        res.status(400).json({err});
    }
}

module.exports.login_post = async(req , res) => {
    const { email , password } = req.body;

    try {
        const user = await User.login(email , password);
        if(user){
            const token = createToken(user._id);
            res.cookie('jwt' , token , {httpOnly: true , maxAge: maxAge * 1000 ,sameSite: 'none',secure: true} )
            res.status(201).json({user});
        }
    }
    catch(err) {
        const errors = handelError(err);
        res.status(400).json({errors});
    }
}

module.exports.logout = (req , res) => {
    res.cookie('jwt' , '' , {maxAge: 1,sameSite: 'none',secure: true })
    res.status(201).json('cookie deleted');
}

module.exports.admin_logout = (req , res) => {
    res.cookie('admin_jwt' , '' , {maxAge: 1,sameSite: 'none',secure: true })
    res.status(201).json('cookie deleted');
}

module.exports.login_admin = async(req , res) =>{
    const { email , password } = req.body;

    try {
        const user = await Admin.login(email , password);
        if(user){
            const token = createAdminToken(user._id);
            res.cookie('admin_jwt' , token , {httpOnly: true , maxAge: maxAge * 1000 ,sameSite: 'none',secure: true} )
            res.status(201).json("Login Successfull");
        }
    }
    catch(err) {
        const errors = handelError(err);
        res.status(400).json({errors});
    }
}