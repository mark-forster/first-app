const {Post,validatePost} = require("../models/post.model");
const slugify = require("slugify");
const logger= require('../config/logger');
const ApiError = require("../middlewares/ApiError");
const fileHelper=require('../config/file')
const httpStatus = require("http-status");
// getting all post
const allPosts = async () => {
  try {
    const posts = await Post.find({}).exec();
    return posts;
  } catch (err) {
    logger.error(err)
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Something went wrong"
    );
  }
};

// creating new post
const newPost = async (shortVideo, image, pdfBook, body,userId) => {

  try {
    const newPost = new Post({
      title: body.title,
      description: body.description,
      userId: userId,
      slug: slugify(body.title)
    });
    if(image){
      const imageArray = image.map(image=>{
        const imageUrl = image.path;
        return imageUrl
      })
      newPost.image = imageArray
    }
   if(shortVideo) {
    newPost.shortVideo = shortVideo[0].path;
   }
   if(pdfBook){
    newPost.pdfBook = pdfBook[0].path;
   }
    await newPost.save();
    return newPost;
  } catch (err) {
    logger.error(err)
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Something went wrong while uploading post"
    );
  }
};

// getting post by slug
const getPostById = async (slug) => {
  try {
    const post = await Post.findOne({ slug: slug });
    if (!post) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Post not found");
    }
    return post;
  } catch (err) {
    logger.error(err)
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Something went wrong"
    );
  }
};

// update post by id
const updatePostById = async (shortVideo, image, pdfBook, postId, body) => {
  try {
    logger.info(`Request received ${JSON.stringify(shortVideo, image, pdfBook,body)}`);
    const post = await Post.findByIdAndUpdate(postId,
      {title: body.title,
        description: body.description,
        slug: slugify(body.title)},
       { new: true });
       if(image){
        fileHelper.deleteFile(post.image);
        post.image = image[0].path;
      }
     if(shortVideo) {
      fileHelper.deleteFile(post.shortVideo)
      post.shortVideo = shortVideo[0].path;
     }
     if(pdfBook){
      fileHelper.deleteFile(post.pdfBook)
      post.pdfBook = pdfBook[0].path;
     }
     await post.save();
    if (!post) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Post Not Found');
    }
    return post;
  } catch (err) {
    console.log(err);
    throw new ApiError(httpStatus.BAD_REQUEST, 'Post Not Found');
}

};
// delete post by ID
const deletePostById = async (id) => {
    const post= await Post.findById(id);
    if(!post){
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "No post found")
    }
    fileHelper.deleteFile(post.image || post.pdfBook || post.shortVideo)
    return await Post.findByIdAndDelete(id);
};
module.exports = {
  allPosts,
  newPost,
  getPostById,
  updatePostById,
  deletePostById,
};
