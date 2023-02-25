const DB = require('../models/user');
const Post = require('../models/post');
const User = require('../models/user');


module.exports.profile = function(req,res){
    User.findById(req.params.id,function(err,user){
        return res.render('profile',{
            title : user.name+" profile",
            profile_user: user
        });
    });
}


module.exports.signup = function (req,res) {
    if(req.isAuthenticated()){
        return res.redirect('/user/profile');
    }
    return res.render('signup',{
        title : "SignUp Page"
    })
};
module.exports.signin = function (req,res) { 
    if(req.isAuthenticated()){
        return res.redirect('/user/profile');
    }
    return res.render('signin',{
        title : "SignIn Page"
    })
};

module.exports.create = function(req,res){
    if(req.body.password != req.body.cnfpassword){
        console.log('Password Missmatch');
        req.flash('error',"Password Missmatched! Try again");
        return res.redirect('back');
    }
    DB.findOne({username : req.body.username},function(err,user){
        if(err){console.log('Error finding the user while in signup page'); return;}
        if (!user){
            DB.create(req.body,function(err,user){
                if(err){console.log('Error creating a User in Signup page'); return;}


                req.flash('success',"Successfully created User! SignIn please!");
                console.log('Successfully created User! SignIn please!');
                return res.redirect('/user/signin');
            })
        }else{
            req.flash('error',"User Already exist");
            console.log('User Already exist!');
            return res.redirect('back');
        }
    });
};

// module.exports.createSession = function(req,res){
//     // find user in the database
//     DB.findOne({ username : req.body.username },function(err,user){
//         if(err){console.log('Error finding the user while in signIn page'); return;}
//         // if user found handle
//         if(user){
//             // if password doen't match
//             if(user.password != req.body.password){
//                 console.log("Password didn't match");
//                 return res.redirect('back');
//             }
//             // if password match handle session

//             res.cookie('user_id',user.id);
//             return res.redirect('/user/profile');

//             // return res.render('profile',{
//             //     title : 'Profile',
//             //     user : user
//             // });
//         }
//         // if user not found
//         else{
//             console.log('User is Not Found');
//             return res.redirect('back');
//         }
//     });
// }

module.exports.signout = function(req,res){
    // res.clearCookie('user_id');
    req.logout(function (err) {
        if(err){
            // console.log("Error in logging out");
            req.flash('error','some error happened');
            return res.redirect('back');
            }
        });
    req.flash('success','You have LoggedOut!');
    return res.redirect('/');
}


module.exports.createSession = function (req,res) {
    req.flash('success','SignedIn SucessFully!')
    return res.redirect('/');
}

// module.exports.signout = function(req,res,next){
//     req.logout(function(err) {
//         if (err) { return next(err); }
//         res.redirect('/');
//       });
//     return res.redirect('/');
// }
module.exports.update = function(req,res){
    if(req.user.id == req.params.id){
        // User.findByIdAndUpdate(req.params.id,{name: req.body.name, username: req.body.username})
        User.findByIdAndUpdate(req.params.id,req.body,function (err,user) { 
            if(err){
                return res.redirect("back")
            }
            return res.redirect('/');
        });
    }else{
        return res.status(401).send('unauthorized');
    }
}