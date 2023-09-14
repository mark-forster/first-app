const express = require('express');
const router = require('express').Router();
const {
    postComments,
    getPostComments,
    updateComment,
    allComments,
    deleteComment,
    commentAllSearch,
    postLike,
    deleteLike} = require('../../controllers/comment_like.controller')
// const { isAuth} = require('../../middlewares/auth.middleware')
// for comments
router.get('/comments',allComments);
router.get('/comments/:id',getPostComments);
router.post('/comments/:id',postComments)
router.put('/comments/:id',updateComment)
router.delete('/comments/:id',deleteComment)
router.get('/search', commentAllSearch)

// for like
router.post('/like/:id',postLike)
router.delete('/like/:id',deleteLike)
module.exports = router