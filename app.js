const express = require('express')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const authRoutes = require('./routes/authentication')
const passport = require('./passport-config')

/* Environment Variables */
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

/* Server */
const app = express()
app.listen(3000, () => {
    console.log('Listening on localhost:3000')
})

/* View engine */
app.set('view engine', 'ejs')

/* Middleware */
app.use(express.urlencoded({ extended: true }))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET, // HMAC secret key
    resave: false, // resave session variables if nothing changed
    saveUninitialized: false // don't save empty session values
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

/* Request chain */
app.use(authRoutes)
