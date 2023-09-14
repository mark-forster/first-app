const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt= require('bcrypt');
require('dotenv').config();
const {User}= require('../models/user.model');
module.exports= (passport)=>{
    passport.use(new GoogleStrategy({
        clientID:process.env.GOOGLE_CLIENT_ID,
        clientSecret:process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:8998/v1/auth/google/callback"
      },
     async function(accessToken, refreshToken, profile, done) {
            const user= await User.findOne({ googleId: profile.id });
            if(user){
              return  done(null, user)
            }
            else{
                // create new User
                const hashPassword= await bcrypt.hash(profile.emails[0].value,12);
                const newUser = new User({
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: hashPassword,
                });
                await newUser.save();
                return done(null, newUser);
            }
      }
    ));

    passport.serializeUser(async(user, done)=>{
      done(null, user.id);
    });
    
    passport.deserializeUser(async(id, done) =>{
    
      try {
          const user = await User.findById(id);
          if(!user){
            throw new Error('User not found');
          }
          done(null, user);
       
      } catch (err){
        done(err, null);
      }
  })

}