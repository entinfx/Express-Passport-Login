/* Express */
const express = require('express')
const app = express()

/* View engine */
app.set('view engine', 'ejs')

/* Server */
app.listen(3000, () => {
    console.log('Listening on localhost:3000')
})

/* Middleware */
app.use(express.urlencoded({ extended: true }))

/* Model */
let users = []

/* User authentication routes */
// Index page: /
app.get('/', (req, res) => {
    res.render('./index', { title: 'Auth Demo', body: 'Passport Auth Demo!' })
})

// Login form: /login
app.get('/login', (req, res) => {
    res.render('./login', { title: 'Log In' })
})

app.post('/login', (req, res) => {
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
        res.render('./index', { title: 'Auth Demo', body: 'Welcome back!' })
    } else {
        console.log('Incorrect login data!')
        res.render('./login', { title: 'Log In | Error' })
    }
})

// Sign Up form: /signup
app.get('/signup', (req, res) => {
    res.render('./signup', { title: 'Sign Up' })
})

app.post('/signup', (req, res) => {
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

    res.render('./index', { title: 'Auth Demo', body: 'Hello, Welcome!' })
})
