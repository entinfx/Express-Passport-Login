const express = require('express')
const passport = require('passport')
const { scryptSync, randomBytes } = require('crypto')
const users = require('../model/user')

const router = express.Router()

router.get('/', checkAuthenticated, (req, res) => {
    res.render('./index', { name: (req.user?.name ?? 'guest user') })
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
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password
    const salt = randomBytes(16).toString('hex')
    const passwordHash = scryptSync(password, salt, 64).toString('hex')

    users.push({
        id: users.length,
        name,
        email,
        passwordHash: `${salt}:${passwordHash}`
    })

    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })

    res.render('./index', { name })
})

router.delete('/logout', (req, res, next) => {
    req.logOut((error) => {
        if (error) return next(error)
        res.redirect('/')
    })
})

function checkAuthenticated(req, res, next) {
    if (req.user) { // TODO: try req.isAuthenticated
        next()
    } else {
        res.status(401).redirect('/login')
    }
}

function checkNotAuthenticated(req, res, next) {
    if (req.user) { // TODO: try req.isAuthenticated
        res.status(403).redirect('/')
    } else {
        next()
    }
}

module.exports = router
