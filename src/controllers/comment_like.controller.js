const httpStatus = require('http-status');
const catchAsync = require("../middlewares/catchAsync");
const logger= require('../config/logger');

const { getAllComments,
    getCommentByPostId,
        createComments,
        EditComments,
        deleteCommentById,
        unLike,
        createLike} = require('../services/comment_like.service')
const {Comment} = require('../models/comment_like.model')
// for comments
const allComments = catchAsync(async (req,res,next) => {
    const allComments = await getAllComments()
    res.status(httpStatus.OK).json(allComments)
})
// get post comments
const getPostComments= catchAsync(async (req,res,next) => {
        const postId= req.params.postId;
        const comments= await getCommentByPostId(postId);
    res.status(httpStatus.OK).json(comments)

})
const postComments =  catchAsync( async(req, res,next) => {
    const body = req.body;
    // const current_user = req.user;
    const current_user_id = '6501b706376ec370a3a6e749'
    const postId = req.params.id;
    // const comment =await createComments(postId,current_user.id,body);
    const comment =await createComments(postId,current_user_id,body);
    res.status(httpStatus.CREATED).json({success:"success comment",comment})
})
const updateComment = catchAsync( async(req, res, next) => {
    const body = req.body;
    const id = req.params.id; // Retrive the value of the 'id' parameter from the URL
    const updateComment = await EditComments(id, body);
    res.status(httpStatus.CREATED).json({success:"update  comment successfully!",updateComment})
});
const deleteComment = catchAsync( async(req, res,next) => {
    const commentId = req.params.id; // Retrieve the value of the 'id' parameter from the URL
    await deleteCommentById(commentId)
    res.status(httpStatus.NO_CONTENT).json({success:"delete comment successfully!"})
});

// for like
const postLike = catchAsync( async(req, res, next) => {
    const postId = req.params.id;
    // const current_user =req.user;
    const current_user_id = '6501b706376ec370a3a6e749'
    // const like = await createLike(postId, current_user.id)
    const like = await createLike(postId, current_user_id)
    res.status(httpStatus.OK).json({success:"like successfully",like})
       
});

const deleteLike = catchAsync( async(req, res, next) => {
    const likeId = req.params.id; // Retrieve the value of the 'id' parameter from the URL
    await unLike(likeId)
    res.status(httpStatus.OK).json({success:"delete like successfully!"})
}) 

const commentAllSearch = catchAsync(async (req, res) => {
    const searchField = req.query.text;
    try{
        const comments = await Comment.find({text:{$regex: searchField,$options:'i'}})
        if(comments.length < 1){
            return res.status(httpStatus.NOT_FOUND).json("Comment not found")
        }
        res.status(httpStatus.OK).json(comments)
    }
       catch(err){
        logger.error(err)
       }  
   });
module.exports = {
    postComments,
    getPostComments,
    updateComment,
    allComments,
    deleteComment,
    commentAllSearch,
    postLike,
    deleteLike
};