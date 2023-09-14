const express = require("express");
const router = express.Router();
const userController = require('../../controllers/user.controller');
const passport = require("passport");

// Auth middleware
const { isAuth } = require("../../middlewares/auth.middleware");

/** __Simple Routes__ */
router.post("/register", userController.register);
router.post("/login", userController.login);

// google oauth 20
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  function (req, res, next) {
    // Successful authentication, redirect home.
    res.redirect("/dashboard");
  }
);

// forgot Password
router.post("/forgot-password", userController.forgotPassword);
// resetPassword
router.get("/reset-password/:token", userController.resetPassword);
//post resetpassword
router.put("/update-password/:token", userController.updateresetPassword);
//  change Password
router.put("/change-password",  userController.changePassword);
// change UserName
router.put("/change-userName",  userController.changeUserName);
// profile route
router.get("/profile/:id",  userController.profile);
// update biography
router.put("/biography", isAuth, userController.updateBiography);
// const follow / unfollow
router.put('/toggle-follow/:id', isAuth, userController.toggleFollow)
module.exports = router;
