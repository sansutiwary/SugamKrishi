const express = require('express');
const homeController = require('../controllers/homeController');
const routes = express.Router();
routes.get('/',homeController.welcome);

routes.get('/home',function(req,res){
    return res.redirect('/');
});

routes.use('/about',require('./about'));
routes.use('/user',require('./user'));
routes.use('/posts',require('./posts'));
routes.use('/comment',require('./comments'));
module.exports = routes;