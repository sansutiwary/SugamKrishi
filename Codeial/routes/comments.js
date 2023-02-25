const express = require('express');
const passport = require('passport');
const Router = express.Router();
const commentController = require('../controllers/comment_controller');

Router.post('/create',passport.checkAuthentication,commentController.create);
Router.get('/destroy/:id',passport.checkAuthentication,commentController.destroy);
module.exports = Router;