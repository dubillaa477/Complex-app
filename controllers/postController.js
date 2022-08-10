const Post = require('../models/Post')
const { post } = require('../router')


exports.viewCreateScreen = function(req, res) {
    res.render('create-post')
}

exports.viewSinglePost = async function(req, res) {
    try {
        let post = await Post.getPostbyId(req.params.id)
        res.render('single-post-screen', {
            post: post
        })
    } catch (error) {
        res.send("404 Template will go here")
    }
}

exports.create = function(req, res) {
    let post = new Post(req.body, req.session.user._id)
    post.createPost().then(() => {
        res.send("Post created")
    }).catch((errors) => {
        res.send(errors)
    })

}