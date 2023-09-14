const Joi = require("joi");
const { password } = require("../validation/custom.validation");

// Joi validation for registration 
const registrationSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().custom(password).required(),
  });
  
  // Joi validation for login
  const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().custom(password).required(),
  });
  
  // Joi validation for user change password 
  const changePasswordSchema = Joi.object({
    currentPassword :Joi.string().custom(password).required(),
    newPassword: Joi.string().custom(password).required(),
    confirmNewPassword: Joi.string().custom(password).required(),
  });
  
  // Joi validation for username 
  const changeUsernameSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
  });
  
  //Joi validation for reset password
  const resetPasswordSchema = Joi.object({
    newPassword: Joi.string().custom(password).required(),
    confirmPassword: Joi.string().custom(password).required(),
  });

   // Joi validation for forgot password
   const forgotPasswordSchema = Joi.object({
    email: Joi.string().email().required()
  });
  
// module exports
module.exports = {
    registrationSchema,
    loginSchema,
    changePasswordSchema,
    changeUsernameSchema,
    resetPasswordSchema,
    forgotPasswordSchema
  };
  