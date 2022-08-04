//Requirements
const express = require('express')
const session = require('express-session')
const mongoStore = require('connect-mongo')
const app = express()

//Set up server for session
let sessionOptions = session({
    secret: "javascript is cool",
    store: mongoStore.create({ client: require("./db") }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60,
        httpOnly: true
    }
})

app.use(sessionOptions)

const router = require('./router')

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

//Sets public folder as default 
app.use(express.static('public'))

//Set up template engine
app.set('views', 'views')
app.set('view engine', 'ejs')

//Seting up router actions
app.use('/', router)

module.exports = app