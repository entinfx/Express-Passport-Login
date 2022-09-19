const express = require('express')
const router = express.Router()

router.get('/signup', signupForm)
router.get('/login', loginForm)
router.post('/signup', signup)
router.post('/login', login)

/* Model */
let users = []

/* Handle requests */
function signupForm(req, res) {
    res.render('./form', { title: 'Sign Up', signup: true })
}

function loginForm(req, res) {
    res.render('./form', { title: 'Log In', signup: false })
}

function signup(req, res) {
    const { scryptSync, randomBytes } = require('crypto')

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
}

function login(req, res) {
    const { scryptSync, timingSafeEqual } = require('crypto')

    const email = req.body.email
    const providedPassword = req.body.password
    const user = users.find(u => u.email === email )

    if (!user) {
        console.log(`User not found`)
        return
    }

    const [storedSalt, storedPasswordHash] = user.passwordHash.split(':')
    const providedPasswordHash = scryptSync(providedPassword, storedSalt, 64)
    const match = timingSafeEqual(providedPasswordHash, Buffer.from(storedPasswordHash, 'hex'))

    if (match) {
        console.log('Welcome back!')
    } else {
        console.log('Incorrect login data!')
    }
}

module.exports = router
