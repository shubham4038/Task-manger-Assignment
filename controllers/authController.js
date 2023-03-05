const User = require('../models/userModel');
const sendEmail = require('../utils/email');
const jwt = require('jsonwebtoken')
const {promisify} = require('util');

exports.signup = async (req,res)=> {
    try {
        //Sending user deatils from req body
        const {firstname , lastname , email, password,passwordConfirm} = req.body;
        const user = await User.findOne({email})
        if(user){
            return res.status(201).json({
                status:"failed",
                message:"email already exist"
                
            })
        }
        const newUser = await User.create({firstname,lastname,email,password,passwordConfirm});
        //OTP generation
        const OTP = Math.floor(100000 + Math.random() * 900000);
        newUser.OTP=OTP;
        await newUser.save({validateBeforeSave:false});
        const emailSubject = 'OTP Verification Code';
        const emailText = `Your OTP verification code is ${OTP}`;
        const emailHtml = `<p>Your OTP verification code is <strong>${OTP}</strong></p>`;
        await sendEmail(email, emailSubject, emailText, emailHtml);
        res.status(201).json({
            status:"Success",
            message:"Sign up successfull Please verify your otp to Login",
            
        })
    } catch (error) {
        res.status(400).json({
            status:"Failed",
            message: "error in user creation",
            error
        }
          )
    }
}

exports.login = async (req,res)=>{
    try {
    const {email,password} = req.body;
    // To check if user entered email or password
    if(!email || !password){
      res.status(400).json({
            status:"Failed",
            message: "Please enter email or password",
        })
    }
    const user = await User.findOne({email}).select('+password');

    // To check if user exixst or not in db and also if entered password is same or not
    if(!user || !(await user.verifyPassword(password,user.password))){
        res.status(400).json({
            status:"Failed",
            message: "Please enter valid details",
        })
    }

    //Checking if OTP is verified or not
    if(!(user.otpisVerified)){
        res.status(400).json({
            status:"Failed",
            message: "Please verify your OTP",
        })
    }
    //Creating JWT token 
    let token_jwt = jwt.sign({id:user._id},process.env.JWT_SECRET_KEY,{expiresIn : process.env.JWT_EXPIRY})
    res.status(201).json({
        status:"Success",
        message: "User succesfulyy logged in, You can now create,read,update and delete your Tasks",
        token_jwt,
        userdetails:{
            user
        }
        
    })

    } catch (error) {
        res.status(400).json({
            status:"failed",
            message: "failed to login",
            error
            
        })
    }
    
}

exports.verifyOtp = async (req,res)=>{
    const {email,OTP} = req.body
    //If email or OTp is not entered in body
    if(!email || !OTP){
        res.status(400).json({
            status:"failed",
            message: "Please enter email and otp",
            
        })
    }
    const user = await User.findOne({email});
    console.log(user);
    if(!(Number(OTP) === user.OTP)){
        res.status(400).json({
            status:"failed",
            message: "OTP did n't matched",
    })
    }
    user.otpisVerified=true;
    user.OTP=undefined
    await user.save({validateBeforeSave:false})
    res.status(201).json({
        status:"Success",
        message: "OTP verrified",
})
    
}

exports.protect = async (req,res,next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer') ){
        token = req.headers.authorization.split(' ')[1];
    }
    if(!token){
        res.status(400).json({
            status:"failed",
            message: "User not logged in ",
    })
    }
    const decode = await promisify(jwt.verify)(token,process.env.JWT_SECRET_KEY);
    const user = await User.findById(decode.id);
    req.user = user;
    next();
}