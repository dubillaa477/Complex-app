const validator = require('validator')
const md5 = require('md5')
const usersCollection = require('../db').db().collection("users")
const becrypt = require('bcryptjs')

let User = function(data) {
    this.data = data
    this.errors = []
}

User.prototype.validate = function() {
    return new Promise(async(resolve, reject) => {
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
        if (this.data.password.length > 50) {
            this.errors.push("Passowrd cannot exeed 50 characters")
        }

        if (this.data.username.length > 0 && this.data.username.length < 3) {
            this.errors.push("Username must be at least 3 characters")
        }
        if (this.data.username.length > 16) {
            this.errors.push("Username cannot exeed 16 characters")
        }

        //Validate username is unique
        if (this.data.username.length > 2 && this.data.username.length < 16 && validator.isAlphanumeric(this.data.username)) {
            let usernameExists = await usersCollection.findOne({ username: this.data.username })
            if (usernameExists) { this.errors.push("Username already taken!") }
        }

        //Validate email is unique
        if (validator.isEmail(this.data.email)) {
            let emailExists = await usersCollection.findOne({ email: this.data.email })
            if (emailExists) { this.errors.push("Email already taken!") }
        }

        resolve()
    })
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
    return new Promise(async(resolve, reject) => {
        //Step one, validate data
        this.cleanUp()
        await this.validate()

        //Step two, only if no validation errors
        //then save to db
        if (!this.errors.length) {
            //Hash user password
            let salt = becrypt.genSaltSync(10)
            this.data.password = becrypt.hashSync(this.data.password, salt)
            await usersCollection.insertOne(this.data)
            this.getAvatar()
            resolve()
        } else {
            reject(this.errors)
        }

    })
}

User.prototype.login = function() {
    return new Promise((resolve, reject) => {
        this.cleanUp()
        usersCollection.findOne({ username: this.data.username }).then((attemptedUser) => {
            if (attemptedUser && becrypt.compareSync(this.data.password, attemptedUser.password)) {
                this.data = attemptedUser
                this.getAvatar()
                resolve("Congrats")
            } else {
                reject("Invalid credentials!")
            }
        }).catch(function() {
            reject("Please try again later")
        })
    })
}

User.prototype.getAvatar = function() {
    this.avatar = `https://gravatar.com/avatar/${md5(this.data.email)}?s=128`
}

module.exports = User