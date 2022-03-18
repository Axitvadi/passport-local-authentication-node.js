require("dotenv").config()
require("./config/db")
const { checkNotAuthenticated, checkAuthenticated } = require("./middleware/auth")
const express = require("express")
const app = express()
const bodyparser = require("body-parser")
const passport = require("passport")
const path = require("path")
const LocalStrategy = require("passport-local").Strategy
const expressSession = require('express-session')
const mongoose = require("mongoose")
const USER = mongoose.model('user')

app.use(express.static('public'))

app.use(expressSession({
    secret: process.env.secret,
    resave: false,
    saveUninitialized: false
}))

app.use(
    bodyparser.json({
        limit: "1024mb"
    })
)
app.use(
    bodyparser.urlencoded({
        limit: "1024mb",
        extended: true
    })
)
app.set('views', path.join(__dirname, 'views/pages'))
app.set('view engine', 'ejs')
// -----------------passport-local-authentication---------------------------

passport.use(new LocalStrategy(
    async function (username, password, done) {
        // for get username and password first add username and password at html tag name field
        console.log(username, password)
        USER.findOne({ email: username }, function (err, user) {
            console.log(user)
            if (err) { return done(err); }
            if (!user) { return done(null, false), { Message: "incorrect username." } }
            if (user.password !== password) { return done(null, false), { Message: "incorrect password" } }
            return done(null, user);
        });
    }
));

passport.serializeUser((user, done) => {
    if (user) {
        return done(null, user._id)
    }
    return done(null, false)
})
passport.deserializeUser((_id, done) => {
    USER.findById(_id, (err, user) => {
        if (err) return done(null, false)
        return done(null, user)
    })
})

app.use(passport.initialize())
app.use(passport.session())

app.post('/login', passport.authenticate('local', {
    successRedirect: '/main',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get('/',checkNotAuthenticated, (req, res) => res.render('signup'))
app.get('/login', checkNotAuthenticated, (req, res) => res.render('login'))
app.get('/signup', checkNotAuthenticated, (req, res) => { res.render('signup') })
app.post('/signup', async (req, res) => {
    try {
        const created = await USER.create(req.body)
        if (!created) {
            res.redirect('/signup')
        }
        res.redirect('/login')
    } catch (err) {
        res.json({ Message: err })
    }
})
app.get('/main', checkAuthenticated, (req, res) => res.render('main', { username: req.user?.username }))
app.get('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})

const port = process.env.PORT || 4000
app.listen(port, () => console.log(`server started successful on port ${port}`))