const express = require('express');
const authRoute = require('./auth.route');
const commentLikeRoute = require('./comment_like.route');
const postsRoute = require('./post.route');
const router = express.Router();

const defaultRoutes = [
    {
      path: '/auth',
      route: authRoute,
    },
    {
      path:'/comment_like',
      route: commentLikeRoute
    },
    {
      path:'/api_posts',
      route: postsRoute
    }
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

module.exports = router;