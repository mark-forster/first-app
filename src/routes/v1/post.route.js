const express = require('express');
const router = require('express').Router();
const { Posts, createNewPost, getSinglePost, updatePost, deletePost, postAllSearch, userAllSearch } = require('../../controllers/post.controller') 
// const { isAuth} = require('../../middlewares/auth.middleware')
const upload= require('../../middlewares/image_upload');

router.get('/posts', Posts);
// create new post
router.post('/create-post', upload.fields([{
    name: 'image', maxCount: 1
  }, {
    name: 'shortVideo', maxCount: 1
  },{
    name: 'pdfBook', maxCount: 1
}]), createNewPost);

// get single post
router.get('/post/:slug', getSinglePost)
// update Post
router.put('/update-post/:id',upload.fields([{ 
  name: 'image', maxCount: 4
}, {
  name: 'shortVideo', maxCount: 1
},{
  name: 'pdfBook', maxCount: 1
}]), updatePost)
// delete post
router.delete('/delete-post/:id', deletePost)
// search for posts
router.get('/search', postAllSearch)
router.get('/user-search', userAllSearch)

module.exports = router