const { User } = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const httpStatus = require("http-status");
const logger = require("../config/logger");
const ApiError = require("../middlewares/ApiError");
const { hashData, verifyHashedData } = require("../config/hash_pass");
const createError = require("http-errors");


/////////// Rgister user ///////////
const signUp = async (body) => {
  const { name, email, password } = body;
    // Exiting User
    const exitingUser = await User.findOne({ email: email });
    if (exitingUser) {
      throw createError.Conflict({ message: "Email is already registered" });
    }
 
    // Hashing Password.... $##@$$$...
    const hashedPass = await hashData(password);
    
    // Creating a New user...💁...
    const newUser = new User({
      name: name,
      email: email,
      password: hashedPass,
    });
    await newUser.save();
    return newUser;
};

/////////// Login user ///////////
const signIn = async (body) => {
  const { email, password } = body;
  if (!(email || password)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "All fields are required");
  }
  // check user exits
  const exitUser = await User.findOne({ email: email });
  if (!exitUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email id not found");
  }

  // check password
  const match = await bcrypt.compare(password, exitUser.password);

  if (!match) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Password does not match");
  }
  //   generate Token
  const token = jwt.sign(
    { email: exitUser.email, id: exitUser._id },
    process.env.JWT_KEY,
    { expiresIn: process.env.TOKEN_EXPIRY }
  );
  const user = await User.findByIdAndUpdate(exitUser._id, {
    token: token,
  },{new: true});
  return { user, token };
};

/////////// Password reset ///////////
const PasswordReset = async (token, body) => {
  const { newPassword, confirmPassword } = body;
  if (!newPassword || !confirmPassword) {
    throw new ApiError(httpStatus.BAD_REQUEST, "New password is required");
  }
  if (newPassword !== confirmPassword) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Confirm password must be reference of new password");
  }
  //   decoded token
  const decodeToken = jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
    // if (err) {
    //   throw new ApiError(
    //     httpStatus.INTERNAL_SERVER_ERROR,
    //     "Something went wrong"
    //   );
    // }

    return decoded;
  });
  //   hashing new password
  const hashPassword = await bcrypt.hash(newPassword, 12);
  const user = await User.findByIdAndUpdate(
    decodeToken._id,
    {
      password: hashPassword,
    },
    { new: true }
  );
  return user;
};

/////////// Change current password ///////////
const changeCurrentPassword = async (id, body) => {
  const { currentPassword, newPassword, confirmNewPassword } = body;

  if (!currentPassword && !newPassword && !confirmNewPassword) {
    throw new ApiError(httpStatus.BAD_REQUEST, "All fields are required");
  }

  // getting current User
  const currentUser = await User.findById({ _id: id });
  // checking current Password
  const matchedPassword = await bcrypt.compare(
    currentPassword,
    currentUser.password
  );
  if (!matchedPassword) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Current password is incorrect");
  } else {
    if (newPassword !== confirmNewPassword) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "New password must the same as the  confirmNewpassword"
      );
    }
    // hashing new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    const user = await User.findByIdAndUpdate(
      id,
      {
        password: hashedPassword,
      },
      { new: true }
    );
    return user;
  }
};

/////////// Change current user name ///////////
const changeCurrentUserName = async (id, body) => {
  const { name } = body;
  if (!name) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Name is required");
  }

  // getting current User
  const currentUser = await User.findById({ _id: id });
  const user = await User.findByIdAndUpdate(
    id,
    {
      name: name,
    },
    { new: true }
  );
  return user;
};

/////////// Getting user profile ///////////
const getProfile = async (id) => {
  // getting current User
  const currentUser = await User.findById(id);
  return currentUser;
}

/////////// Getting user biography ///////////
const getBiography = async (id, body) => {
  //update biography
  const updateBiography = await User.findByIdAndUpdate(id, { bio: body.bio }, { new : true});
  return updateBiography;
}

module.exports = {
  signUp,
  signIn,
  PasswordReset,
  changeCurrentPassword,
  changeCurrentUserName,
  getProfile,
  getBiography
};
