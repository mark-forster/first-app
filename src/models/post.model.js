const mongoose = require("mongoose");
const Joi = require("joi");
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image:{
   type: Array,
   default:''
},
  shortVideo: {
    type: String,
    default:''
  },
  pdfBook: {
   type: String,
   default:''
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  slug: {
    type: String,
    required: true,
  }
});

const validatePost = (post) => {
  const schema = Joi.object({
      title: Joi.string().min(2).required(),
      description: Joi.string().min(2),
      image: Joi.string(),
      pdfBook: Joi.string(),
      shortVideo:Joi.string(),
  })
  return schema.validate(post);
}


const Post = mongoose.model("Post", postSchema);

module.exports = {Post,validatePost};
