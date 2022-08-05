const { response } = require('../app')
const User = require('../models/User')
const { use } = require('../router')

exports.login = function(req, res) {
    let user = new User(req.body)
    user.login().then(async function(result) {
        req.session.user = {
            username: user.data.username,
            avatar: user.avatar
        }
        await req.session.save()
        res.redirect('/')
    }).catch(async function(e) {
        req.flash('errors', e)
        await req.session.save()
        res.redirect('/')
    })
}

exports.logout = async function(req, res) {
    //Form using callbacks
    //req.session.destroy(function(){
    //    res.redirect('/')
    //})
    await req.session.destroy()
    res.redirect('/')
}

exports.register = async function(req, res) {
    let user = new User(req.body)
    user.register().then(
        async() => {
            req.session.user = { username: user.data.username, avatar: user.avatar }
            req.session.save()
            res.redirect('/')
        }
    ).catch(async(regErrors) => {
        regErrors.forEach(function(error) {
            req.flash('regErrors', error)
        })
        await req.session.save()
        res.redirect('/')
    })
}

exports.home = function(req, res) {
    if (req.session.user) {
        res.render('home-dashboard', { username: req.session.user.username, avatar: req.session.user.avatar })
    } else {
        res.render('home-guest', { errors: req.flash('errors'), regErrors: req.flash('regErrors') })
    }
}