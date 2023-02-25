const Comment = require('../models/comment');
const Post = require('../models/post');

// module.exports.create = function (req, res) {
//     Post.findById(req.body.post, function (err, post) {
//         if (post) {
//             Comment.create({
//                 content: req.body.content,
//                 user: req.user._id,
//                 post: req.body.post
//             }, function (err, comment) {
//                 if (err) {
//                     console.log("Error creating Comment");
//                     return;
//                 }
//                 post.comments.push(comment._id);
//                 post.save();
//                 return res.redirect('/');
//             })
//         }
//     })
// }

module.exports.create = async function (req, res) {
    try{
        let post = await Post.findById(req.body.post);
        if (post) {
            let comment = await Comment.create({
                    content: req.body.content,
                    user: req.user._id,
                    post: req.body.post
                });
            post.comments.push(comment);
            post.save();

            if(req.xhr){
                comment = await comment.populate('user','name').execPopulate();
                return res.status(200).json({
                    data : {
                        comment : comment
                    },
                    message : "Comment Added!"
                })
            }

            req.flash('success','Comment Added !');
            return res.redirect('/');
            }
    }catch(err){
        console.log("Error->",err);
        return;
    }
}










// module.exports.destroy = function (req, res) {
//     Comment.findById(req.params.id, function (err, comment) {
//         if (err) {
//             console.log("Error finding the comment while deleting");
//             return res.redirect('back');
//         }
//         if (comment.user == req.user.id){
//             let postID = comment.post;
//             comment.remove();
//             Post.findByIdAndUpdate(postID, { $pull: { comments: req.params.id } }, function (err, post) {
//                 return res.redirect('back');
//             })
//         } else {
//             return res.redirect('back');
//         }
//     })
// }

module.exports.destroy = async function (req, res) {
    try{
        let comment = await Comment.findById(req.params.id);
        let post  = await Post.findById(comment.post);
        if (post) {
            let PostUserID = post.user;
            if (req.user.id == PostUserID || comment.user == req.user.id) {
                let postID = comment.post;
                comment.remove();
                req.flash('success','Comment Removed !');
                Post.findByIdAndUpdate(postID, { $pull: { comments: req.params.id } },function(err,data){ /*console.log("Error->",err,"Data->",data)*/ });

                if(req.xhr){
                    return res.status(200).json({
                        comment_id : req.params.id,
                        message : "Comment Deleted!"
                    })
                }

                return res.redirect('back');
            }
            else{
                return res.redirect('back');
            }
        }
        else{
            req.flash('error',"Post Not found to delete the comment");
            return res.redirect('back');
        }
    }catch(err){
        console.log("Error->",err);
        return res.redirect('back');
    }
}