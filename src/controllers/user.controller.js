const { User }  = require("../models/user.model");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/email");
const httpStatus = require("http-status");
const logger = require("../config/logger");
const {
  signUp,
  signIn,
  PasswordReset,
  changeCurrentPassword,
  changeCurrentUserName,
  getProfile,
  getBiography,
} = require("../services/user.service");
const catchAsync = require("../middlewares/catchAsync");
const {registrationSchema,
  loginSchema,
  changePasswordSchema,
  changeUsernameSchema,
  resetPasswordSchema,
  forgotPasswordSchema} = require("../validation/auth.validation");
const mongoose = require("mongoose");

/** __Login with your email__ */
const login = catchAsync(async (req, res, next) => {
  try {
    // getting inputfields
    const body = req.body;

    // Validate user login data
    const { error, value } = loginSchema.validate(body);

    if (error) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ success: true, message: error.details[0].message });
    } else {
      const result = await signIn(body);
      return res
        .status(httpStatus.CREATED)
        .json({ success: true, message: "Login Successfully", user: result });
    }
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
});

/** __Register with Email__ */
const register = catchAsync(async (req, res) => {
  try {
    const body = req.body;

    // Validate user registration data
    const { error, value } = registrationSchema.validate(body);

    if (error) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ success: true, message: error.details[0].message });
    } else {
      // Result in registration
      const result = await signUp(body);
      return res
        .status(httpStatus.CREATED)
        .json({
          success: true,
          message: "Register Successfully",
          user: result,
        });
    }
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json({ error: error.message });
  }
});

// resetPassword
const forgotPassword = async (req, res) => {
  // get email from body
  const body  = req.body;
  const { error, value } = forgotPasswordSchema.validate(body);
  if (error) {
    return res.status(httpStatus.BAD_REQUEST).json({ success: true, message: error.details[0].message });
  }
  if (!body.email) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ success: false, message: "Email is required" });
  }
  try {
    const user = await User.findOne({ email: body.email });
    const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY, {
      expiresIn: "30m",
    });

    //Send the token Back to the user Email
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/v1/auth/reset-password/${token}`;
    const message = `We have recived a password reset request.Please use the below link to reset your password \n\n${resetUrl}\n\nThis reset password Link will be valid only for 30 minutes`;
    await sendEmail({
      email: req.body.email,
      subject: "Password change requires recived",
      message: message,
    });
    return res.json({
      success: "Reset password link send to your email address",
    });
  } catch (err) {
    logger.error(err);
  }
};
// go to the reset password form
const resetPassword = catchAsync(async (req, res, next) => {
  return res
    .status(httpStatus.OK)
    .json({ success: true, message: "Password reseted" });
});

// update resedt password
const updateresetPassword= catchAsync(async (req, res, next) => {
  const token = req.params.token;
  const body = req.body;
  const { error, value } = resetPasswordSchema.validate(body);
  if (error) {
    return res.status(httpStatus.BAD_REQUEST).json({ success: true, message: error.details[0].message });
  }
  const result = await PasswordReset(token, body);
  return res.status(httpStatus.CREATED).json({ success: true, message: "Password reseted Successfully", result });
});

// change Password
const changePassword = catchAsync(async (req, res, next) => {
  // get userID
  // const { id } = req.user;
  const id = '6501b706376ec370a3a6e749'
  const body = req.body;
  const { error, value } = changePasswordSchema.validate(body);
  if (error) {
    return res.status(httpStatus.BAD_REQUEST).json({ success: true, message: error.details[0].message });
  } else {
    // Result change password
    const result = await changeCurrentPassword(id, body);
    return res.status(httpStatus.CREATED).json({ success: true, message: "Password Changed" , user:result });
  }
});

const changeUserName = catchAsync(async (req, res, next) => {
  const body = req.body;
  // getting userId
  // const { id } = req.user;
  const id = '6501b706376ec370a3a6e749'
  // Validate change username
  const { error, value } = changeUsernameSchema.validate(body);
  if (error) {
    return res.status(httpStatus.BAD_REQUEST).json({ success: true, message: error.details[0].message });
  }else{
    const result = await changeCurrentUserName(id, body);
    return res.status(httpStatus.CREATED).json({ success: true, message: "User name Changed Successfully" ,user:result});
  }
});

// user profile
const profile = catchAsync(async (req, res, next) => {
  // getting userId
  // const { id } = req.user;
  const id = req.params.id;
  const result = await getProfile(id);
  return res.status(httpStatus.CREATED).json({ success: true, user: result });
});

const toggleFollow = async (req, res, next) => {
  try {
    const currentUserId = req.user.id;
    const otherUserId = req.params.id;

    if (currentUserId === otherUserId) {
      throw new Error("You can't follow yourself");
    }

    const currentUser = await User.findById(currentUserId);
    const otherUser = await User.findById(otherUserId);

    if (!currentUser.followings.includes(otherUserId)) {
      currentUser.followings.push(otherUserId);
      otherUser.followers.push(currentUserId);

      await User.findByIdAndUpdate(
        currentUserId,
        { $set: currentUser },
        { new: true }
      );
      await User.findByIdAndUpdate(
        otherUserId,
        { $set: otherUser },
        { new: true }
      );

      return res
        .status(200)
        .json({ msg: "you have successfully followed the user" });
    } else {
      currentUser.followings = currentUser.followings.map(
        (id) => id !== otherUserId
      );
      otherUser.followers = otherUser.followers.map(
        (id) => id !== currentUserId
      );

      await User.findByIdAndUpdate(
        currentUserId,
        { $set: currentUser },
        { new: true }
      );
      await User.findByIdAndUpdate(
        otherUserId,
        { $set: otherUser },
        { new: true }
      );
      return res
        .status(httpStatus.CREATED)
        .json({ msg: "you have successfully unfollowed the user" });
    }
  } catch (err) {
    logger.info(err.message);
  }
};

// User Biography
const updateBiography = catchAsync(async (req, res) => {
  const { id } = req.user;
  const body = req.body;
  const result = await getBiography(id, body);
  return res.status(httpStatus.CREATED).json({ success: true, user: result });
});

module.exports = {
  login,
  register,
  forgotPassword,
  resetPassword,
  updateresetPassword,
  changePassword,
  changeUserName,
  profile,
  toggleFollow,
  updateBiography,
};
