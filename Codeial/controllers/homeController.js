const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');


// module.exports.welcome = function (req,res) {
//     // console.log(req.url);
//     // console.log(req.cookies);
//     // Post.find({}, function(err, post){
//     //     if(err){
//     //         console.log("Error Find Post in Post Schema");
//     //         return;
//     //     }
//     //     return res.render('home',{
//     //         title : "LUCIFER | HOME",
//     //         posts : post
//     //     });
//     // })

//     Post.find({})
//     .populate('user')
//     .populate({
//         path : 'comments',
//         populate : {
//             path : 'user'
//         }
//     })
//     .exec(function(err,post){

//         // /doing this to access all the users
//         User.find({},function (err,users) {
//             return res.render('home',{
//                 title : "LUCIFER | HOME",
//                 posts : post,
//                 all_users: users
//             });
//         });
//     })
// }





module.exports.welcome = async function (req,res) {
    try{
        let post = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path : 'comments',
            populate : {
                path : 'user'
            }
        })
        let users = await User.find({});
        return res.render('home',{
            title : "SUGAM KRISHI | HOME",
            posts : post,
            all_users: users
        });
    }
    catch(error){
        console.log("Error",error);
        return;
    }
}




// using then
// Post.find({}).populate('comments').then(function(){});


// using proper promise syntax like
// let posts = Post.find({}).populate('comments').then(function(){});
// posts.then();