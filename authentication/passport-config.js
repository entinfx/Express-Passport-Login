const passport = require('passport')
const { scryptSync, timingSafeEqual } = require('crypto')
const users = require('../model/user')

const LocalStrategy = require('passport-local').Strategy

passport.use(new LocalStrategy({ usernameField: 'email' }, (email, providedPassword, callback) => {
    const user = users.find(u => u.email === email)
    if (!user) return callback(null, false, { message: 'User not found' })

    const [storedSalt, storedPasswordHash] = user.passwordHash.split(':')
    const providedPasswordHash = scryptSync(providedPassword, storedSalt, 64)
    const match = timingSafeEqual(providedPasswordHash, Buffer.from(storedPasswordHash, 'hex'))

    if (match) {
        callback(null, user)
    } else {
        callback(null, false, { message: 'Incorrect password' })
    }
}))

passport.serializeUser((user, callback) => {
    return callback(null, user.id)
})

passport.deserializeUser((id, callback) => {
    return callback(null, users.find(u => u.email === email))
})

module.exports = passport
