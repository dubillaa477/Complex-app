const { transformFileAsync } = require('@babel/core')

const postsCollection = require('../db').db().collection("posts")
const ObjectID = require('mongodb').ObjectId

let Post = function(data, userId) {
    this.data = data
    this.userId = userId
    this.errors = []
}

Post.prototype.cleanUp = function() {
    if (typeof(this.data.title) != "string") { this.data.title = "" }
    if (typeof(this.data.body) != "string") { this.data.body = "" }

    //Get rid bogus properties
    this.data = {
        title: this.data.title.trim(),
        body: this.data.body.trim(),
        createdDate: new Date(),
        author: ObjectID(this.userId)
    }
}

Post.prototype.validate = function() {
    if (this.data.title == "") { this.errors.push("Title cannot be empty") }
    if (this.data.body == "") { this.errors.push("Post cannot be empty") }
}

Post.prototype.createPost = function() {
    return new Promise(async(resolve, reject) => {
        try {
            this.cleanUp()
            await this.validate()
            if (!this.errors.length) {
                //Save post to db
                await postsCollection.insertOne(this.data)
                resolve()
            } else {
                reject(this.errors)
            }
        } catch (error) {
            this.errors.push(error)
            reject(this.errors)
        }
    })
}

Post.getPostbyId = function(id) {
    return new Promise(async function(resolve, reject) {
        if (typeof(id) != "string" || !ObjectID.isValid(id)) {
            reject()
            return
        }
        //Find document on db
        let post = await postsCollection.findOne({ _id: new ObjectID(id) })
        if (post) {
            resolve(post)
        } else {
            reject()
        }
    })
}
Post.prototype.getAllPost = function() {}

module.exports = Post