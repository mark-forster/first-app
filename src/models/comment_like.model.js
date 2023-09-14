const mongoose = require('mongoose')
const Joi =require('joi');
const commentSchema = new mongoose.Schema({
    text:{
        type:String,
        required:true
    },
    postId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post',
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    created_at:{
        type:Date,
        default:Date.now
    },
    updated_at:{
        type:Date,
        default:Date.now
    }
})

const likeSchema = new mongoose.Schema({
    postId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post",
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
})

/**
 * @comment validation
 */

const validateComment = (comment) => {
    const schema = Joi.object({
        text: Joi.string().min(2).max(255).required(),
    })
    return schema.validate(comment);
}

const Comment = mongoose.model("Comment",commentSchema)
const Like = mongoose.model("Like",likeSchema)

module.exports = {
    Comment,
    Like,
    validateComment
}