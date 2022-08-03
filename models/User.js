const validator = require('validator')
const usersCollection = require('../db').collection("users")

let User = function(data) {
    this.data = data
    this.errors = []
}

User.prototype.validate = function() {
    if (this.data.username == "" || this.data.username == null) {
        this.errors.push("You must provide a username.")
    }

    if (!validator.isEmail(this.data.email)) {
        this.errors.push("You must provide a valid email.")
    }

    if (this.data.username != "" && !validator.isAlphanumeric(this.data.username)) {
        this.errors.push("Username can only contain letters and numbers")
    }

    if (this.data.password == "" || this.data.password == null) {
        this.errors.push("You must provide a password.")
    }

    if (this.data.password.length > 0 && this.data.password.length < 8) {
        this.errors.push("Password must be at least 8 characters")
    }
    if (this.data.password.length > 20) {
        this.errors.push("Passowrd cannot exeed 20 characters")
    }

    if (this.data.username.length > 0 && this.data.username.length < 3) {
        this.errors.push("Username must be at least 3 characters")
    }
    if (this.data.username.length > 10) {
        this.errors.push("Username cannot exeed 10 characters")
    }
}

//Avoid code injection
User.prototype.cleanUp = function() {
    if (typeof(this.data.username) != "string") {
        this.data.username = ""
    }
    if (typeof(this.data.email) != "string") {
        this.data.email = ""
    }
    if (typeof(this.data.password) != "string") {
        this.data.password = ""
    }

    //Get rid of any bogus props
    //Also format the data
    this.data = {
        username: this.data.username.trim().toLowerCase(),
        email: this.data.email.trim().toLowerCase(),
        password: this.data.password
    }
}

User.prototype.register = function() {
    //Step one, validate data
    this.cleanUp()
    this.validate()

    //Step two, only if no validation errors
    //then save to db
    if (!this.errors.length) {
        usersCollection.insertOne(this.data)
    }
}

User.prototype.login = function() {
    return new Promise((resolve, reject) => {
        this.cleanUp()
        usersCollection.findOne({ username: this.data.username }).then((attemptedUser) => {
            if (attemptedUser && attemptedUser.password == this.data.password) {
                resolve("Congrats")
            } else {
                reject("Invalid credentials!")
            }
        }).catch(function() {
            reject("Please try again later")
        })
    })
}

module.exports = User