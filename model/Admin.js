const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt')

const adminSchema = new mongoose.Schema({
    fname:{
        type: String,
        required:[true, 'First Name is Required'],
        lowercase:true
    },
    lname:{
        type: String,
        required:[true, 'Last Name is Required'],
        lowercase:true
    },
    email: {
        type: String,
        required: [true , "Email is Required"],
        unique: true,
        lowercase: true,
        validate: [ isEmail , 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true , 'Password is required'],
        minlength: [7 , 'Weak Password'],
    }
})

adminSchema.pre('save' , async function(){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password , salt);
});

adminSchema.statics.login = async function(email , password) {
    const user = await this.findOne( {email} );
    if(user){
        const auth = await bcrypt.compare(password , user.password)
        if(auth) {
            return user
        }
        throw Error('Incorrect Password');
    }
    throw Error('Incorrect Email');
}

const Admin = mongoose.model('admin' , adminSchema);

module.exports = Admin;