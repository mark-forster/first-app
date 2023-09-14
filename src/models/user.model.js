const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  googleId: { type: String, default: null },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    lowercase: true,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  profileImage: {
    type: String,
    default: ""
  },
  date: {
    type: Date,
    default: Date.now,
  },
  token: {
    type: String,
    default: null,
  },
  bio: {
    type: String,
    default: "",
  },
  savedPosts: {
    type: Array,
    default: null,
  },
    followers:[{type:String,default:[]}],
    followings: [{type:String,default:[]}],
});

// Exports user information
const User = mongoose.model("User", UserSchema);

module.exports = { User }
