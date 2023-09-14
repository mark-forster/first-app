const catchAsync = require("../middlewares/catchAsync");
const logger= require('../config/logger')
const {Post} = require("../models/post.model");
const User = require("../models/user.model");
const httpStatus= require('http-status')
const {
  allPosts,
  newPost,
  getPostById,
  updatePostById,
  deletePostById,
} = require("../services/post.service");

// all post
const Posts = catchAsync(async (req, res, next) => {
  const result = await allPosts();
  return res.json({ posts: result });
});
// new Post
const createNewPost = catchAsync(async (req, res, next) => {
  const body = req.body;
  // const current_user = req.user;
  const current_user_id = '6501b706376ec370a3a6e749'
  const image= req.files.image;
  const shortVideo= req.files.shortVideo;
  const pdfBook= req.files.pdfBook;
  // const result = await newPost(shortVideo, image, pdfBook, body, current_user.id);
  const result = await newPost(shortVideo, image, pdfBook, body, current_user_id);
  res.json({ success: " Post Created successfully", result });
});
// single post
const getSinglePost = catchAsync(async (req, res) => {
  const slug = req.params.slug;
  const post = await getPostById(slug);
  return res.json({ success: "success", post: post });
});

// update post
const updatePost = catchAsync(async (req, res) => {
  const body = req.body;
  const image= req.files.image;
  const shortVideo= req.files.shortVideo;
  const pdfBook= req.files.pdfBook;
  const postId = req.params.id;
  const result = await updatePostById(shortVideo, image, pdfBook, postId, body);
  return res.json({ success: "Post updated successfully", post: result });
});
// delete post
const deletePost = catchAsync(async (req, res) => {
  const postId = req.params.id;
  const result = await deletePostById(postId);
  return res.json({ success: "Post deleted successfully" });
});

const postAllSearch = catchAsync(async (req, res) => {
  const searchTitle = req.query.title;
  const searchDes = req.query.description;

    try{
        const posts = await Post.find({
          $or: [
            {title: {$regex: `${searchTitle}`, $options: 'i'}},
            {description: {$regex: `${searchDes}`, $options: 'i'}}
          ]
          })
        res.status(httpStatus.OK).json(posts)
    }
       catch(err){
        logger.error(err)
       } 
});
const userAllSearch = catchAsync(async (req, res) => {
  const searchName = req.query.name;
    try{
      const users = await User.find({name:{$regex: searchName,$options:'i'}})
        res.status(httpStatus.OK).json(users)
    }
       catch(err){
        logger.error(err)
       } 
});
module.exports = {
  Posts,
  createNewPost,
  getSinglePost,
  updatePost,
  deletePost,
  postAllSearch,
  userAllSearch
};
