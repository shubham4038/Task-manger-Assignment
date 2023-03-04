const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    firstname : {
        type:String,
        required:true
    },
    lastname : {
        type:String
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate : [validator.isEmail, 'Please provide valid email' ]
    },
    password:{
        type:String,
        required : [true," Please enter password"],
        minlength : 8,
        select:false
    },
    passwordConfirm:{
        type:String,
        required:[true, "Please confirm your pasword"],
        minlength:8,
        validate:{
            validator: function(el){
                return el=== this.password;
            },
            message : "password is not same"
        },
        
    },
    OTP:{
        type:Number
    },
    otpisVerified:{
        type:Boolean,
        default:false
    },
    tasks : [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Task'
        }
    ]

})

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm= undefined;
    next();
})

userSchema.methods.verifyPassword = async function(enteredPassword,userPassword){
     return bcrypt.compare(enteredPassword,userPassword);
}

const User = mongoose.model('User',userSchema);

module.exports = User;