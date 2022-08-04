const { response } = require('../app')
const User = require('../models/User')
const { use } = require('../router')

exports.login = function(req, res) {
    let user = new User(req.body)
    user.login().then(function(result) {
        req.session.user = {
            username: user.data.username,
            email: user.data.email
        }
        res.send(result)
    }).catch(function(e) {
        res.send(e)
    })
}

exports.logout = function(req, res) {
    res.send("You're out!")
}

exports.register = function(req, res) {
    let user = new User(req.body)
    user.register()
    if (user.errors.length) {
        res.send(user.errors)
    } else {
        res.send("Congrats!")
    }
}

exports.home = function(req, res) {
    if (req.session.user) {
        res.send("Welcome to real home page!")
    } else {
        res.render('home-guest')
    }
}