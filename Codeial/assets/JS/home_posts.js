{
    // method to submit a post using AJAX
    let createPost = function () {
        // var data = new FormData(document.getElementById('post-create'))
        var form = $('#post-create');
        form.submit(function (e){
            e.preventDefault();
            $.ajax({
                type:'post',
                url : '/posts/create',
                data : form.serialize(),
                success : function (data) {
                    let newPost = postCreateDom(data.data.post);
                    $('#all-posts-section').prepend(newPost);
                    destroyPost($(' .post-delete',newPost));
                    // console.log(data);
                    new PostComments(data.data.post_id);
                    document.getElementById('content').value = "";

                    new Noty({
                        theme: 'relax',
                        text: "Post published!",
                        type: 'success',
                        layout: 'topright',
                        timeout: 1500,
                    }).show();
                },
                error : function (err) { 
                    console.log(err.responseText);
                }
            });
        });
    }

    let postCreateDom = function (post) { 
        return $(`<div class="all-posts" id="post-${ post._id }">
            <small><a class="post-delete" href="/posts/destroy/${post._id}">Delete</a></small>
                <p>
                ${ post.content }
                </p>
                <p>Author : ${post.user.name}
                </p>
                <div class="comment-container">
                    <form action="/comment/create" method="post">
                        <input type="text" name="content" placeholder="Type Comment here..." required />
                        <input type="hidden" name="post" value="${post._id}" />
                        <input type="submit" name="Add Comment" />
                    </form>
                    <div class="post-comments-list">
                        <ul id="post-comments-${post._id}">
                            <h2>Comments</h2>
                        </ul>
                    </div>
                </div>
    </div>`)
    }
    let destroyPost = function(DeleteLink){
        $(DeleteLink).click(function (event){
            event.preventDefault();
            $.ajax({
                type: 'get',
                url: $(DeleteLink).prop('href'),
                success: function (data) {
                    $(`#post-${data.data.post_id}`).remove();
                    new Noty({
                        theme: 'relax',
                        text: "Post Deleted!",
                        type: 'success',
                        layout: 'topright',
                        timeout: 1500,
                    }).show();
                },error: function(error){
                    console.log("Error",error.responseText);
                }
            });
        });
    }

    // loop over all the existing posts on the page (when the window loads for the first time) and call the delete post method on delete link of each, also add AJAX (using the class we've created) to the delete button of each
    let convertPostsToAjax = function(){
        $('all-posts-section>div').each(function(){
            let self = $(this);
            let deleteButton = $(' .post-delete',self);
            destroyPost(deleteButton);
            let postId = self.prop('id').split('-')[1];
            new PostComments(postId);
        });
    }



    // method to create a post in DOM
    createPost();
    convertPostsToAjax();
}