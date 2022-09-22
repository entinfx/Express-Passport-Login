const express = require('express')
const { scryptSync, randomBytes } = require('crypto')
const passport = require('./passport-config')
const router = express.Router()

router.get('/', checkAuthenticated, (req, res) => {
    res.render('./index', { name: (req.user?.name ?? 'anonymous') })
})

router.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('./login')
})

router.get('/signup', checkNotAuthenticated, (req, res) => {
    res.render('./signup')
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

router.post('/signup', checkNotAuthenticated, (req, res) => {
    const password = req.body.password
    const salt = randomBytes(16).toString('hex')
    const passwordHash = scryptSync(password, salt, 64).toString('hex')

    users.push({
        id: users.length,
        name: req.body.name,
        email: req.body.email,
        passwordHash: `${salt}:${passwordHash}`
    })

    res.render('./index', { body: 'Hello, Welcome!' })
})

router.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated) {
        return next()
    }

    res.redirect('./login')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated) {
        res.redirect('/')
    }

    next()
}