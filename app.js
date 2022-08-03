//Requirements
const express = require('express')
const app = express()

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