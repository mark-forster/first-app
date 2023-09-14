const httpStatus = require("http-status");
const {Post} = require("../models/post.model");
const logger= require('../config/logger');
const ApiError = require("../middlewares/ApiError");
const {Comment,Like,validateComment} = require("../models/comment_like.model")

const createComments = async (postId,userId,body)  => {
    logger.info(body);
    const { error } = validateComment(body); // Validate the request body using the validation function
    if (error) {
        logger.error(error);
        throw new ApiError(httpStatus.BAD_REQUEST, 'Request Parameter Missing');
    }
    const post = await Post.findById(postId);
    if(!post){
        throw new ApiError(httpStatus.NOT_FOUND, 'Post Not Found');
    }
    const comment = new Comment({
        text:body.text,
        postId:postId,
        userId:userId,
    });
    await comment.save(); // Save the new comment to the database
    return comment;
}
const EditComments = async (id,body)=>{
    try {
        logger.info(`Request received ${JSON.stringify(body)}`);
        const comment = await Comment.findByIdAndUpdate(id, body, {new: true});
        if(!comment){
            throw new ApiError(httpStatus.NOT_FOUND, 'Comment Not Found');
        }
        return comment;
    }catch(err){
        throw new ApiError(httpStatus.NOT_FOUND,'Comment Not Found');
    }
}
const getAllComments = async ()=>{
    try{
        const comments = await Comment.find()
        return comments
    }catch(err){
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR,'Internal Server Error')
    }
}

// getCommentByPostId
const getCommentByPostId = async (id)=>{
        const comments= await Comment.find({postId:id});
        if(!comments){
            throw new ApiError(httpStatus.NOT_FOUND,'Comment Not Found');
        }
        return comments;


}
const deleteCommentById = async(id)=>{
    const comment = await Comment.findById(id)
    if(!comment){
        throw new ApiError(httpStatus.NOT_FOUND,'Comment not found')
    }
    await comment.deleteOne()
    return comment;
}

//for like 
const createLike = async (postId,userId)=>{
    const post = await Post.findById(postId);
    if(!post){
        throw new ApiError(httpStatus.NOT_FOUND, 'Post Not Found');
    }
    const like = new Like({
        postId:postId,
        userId:userId,
    });
    await like.save(); // Save the new like to the database
    return like;
}
const unLike = async (id)=>{
    const like = await Like.findById(id)
    if(!like){
        throw new ApiError(httpStatus.NOT_FOUND,'Like not found')
    }
    await like.deleteOne()
    return like;
}
module.exports = {
    createComments,
    getCommentByPostId,
    EditComments,
    getAllComments,
    deleteCommentById,
    unLike,
    createLike
}