//Requirements
const express = require('express')
const app = express()

//const port = process.env.PORT
const port = 3000

//Sets public folder as default 
app.use(express.static('public'))
    //Set up template engine
app.set('views', 'views')
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('home-guest')
})

app.listen(port)