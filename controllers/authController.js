const User = require("../models/userModel");
const sendEmail = require("../utils/email");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const catchAsync = require("../utils/catchAsync");
const Apperror = require("../utils/apperror");

exports.signup = catchAsync(async (req, res, next) => {
  //Sending user deatils from req body
  const { firstname, lastname, email, password, passwordConfirm } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return next(new Apperror("Email Already exists", 404));
  }
  const newUser = await User.create({
    firstname,
    lastname,
    email,
    password,
    passwordConfirm,
  });
  //OTP generation
  const OTP = Math.floor(100000 + Math.random() * 900000);
  newUser.OTP = OTP;
  await newUser.save({ validateBeforeSave: false });
  const emailSubject = "OTP Verification Code";
  const emailText = `Your OTP verification code is ${OTP}`;
  const emailHtml = `<p>Your OTP verification code is <strong>${OTP}</strong></p>`;
  await sendEmail(email, emailSubject, emailText, emailHtml);
  res.status(201).json({
    status: "Success",
    message: "Sign up successfull Please verify your otp to Login",
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // To check if user entered email or password
  if (!email || !password) {
    return next(
      new Apperror("Please enter email and password to continue", 404)
    );
  }
  const user = await User.findOne({ email }).select("+password");

  // To check if user exixst or not in db and also if entered password is same or not
  if (!user || !(await user.verifyPassword(password, user.password))) {
    return next(new Apperror("Please enter valid details", 404));
  }

  //Checking if OTP is verified or not
  if (!user.otpisVerified) {
    return next(new Apperror("Please verify your OTP to proceed", 404));
  }

  //Creating JWT token
  let token_jwt = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRY,
  });
  res.status(201).json({
    status: "Success",
    message:
      "User succesfulyy logged in, You can now create,read,update and delete your Tasks",
    token_jwt,
    userdetails: {
      user,
    },
  });
});

exports.verifyOtp = catchAsync (async (req, res,next) => {
  const { email, OTP } = req.body;
  //If email or OTp is not entered in body
  if (!email || !OTP) {
    return next(new Apperror("Please enter email and OTP",404));
  }

  const user = await User.findOne({ email });
  if (!(Number(OTP) === user.OTP)) {
    return next(new Apperror("OTP didn't Matched ",404));
  }
  user.otpisVerified = true;
  user.OTP = undefined;
  await user.save({ validateBeforeSave: false });
  res.status(201).json({
    status: "Success",
    message: "OTP verrified",
  });
})

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new Apperror("User is not logged in",404));
  }
  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY);
  const user = await User.findById(decode.id);
  req.user = user;
  next();
})
