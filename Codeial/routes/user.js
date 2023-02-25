const express = require('express');
const router = express.Router();
const user_controller = require('../controllers/user_controller');
const passport = require('passport');
router.get('/',function(req,res){
    // return res.render('profile',{
    //     title : "Profile"
    // });
    return res.send('<img src="https://wallpapers.com/images/high/cool-profile-pictures-red-anime-fw4wgkj905tjeujb.jpg" alt="User photo">')
});
router.get('/signin',user_controller.signin);
router.get('/signup',user_controller.signup);
router.get('/profile/:id',passport.checkAuthentication,user_controller.profile);
router.get('/signout',user_controller.signout);
router.post('/record',user_controller.create);
router.post('/create-session',
    passport.authenticate(
        'local',
        {failureRedirect : '/user/signin'}
    ),
    user_controller.createSession);
router.post('/update/:id',passport.checkAuthentication,user_controller.update);
module.exports = router;