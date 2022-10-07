const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const { scryptSync, timingSafeEqual } = require('crypto')
const users = require('./model/user')

passport.use(new LocalStrategy({ usernameField: 'email' }, (email, providedPassword, done) => {
    try {
        const user = users.find(u => u.email === email)
        if (!user) return done(null, false, { message: 'User not found' })

        const [storedSalt, storedPasswordHash] = user.passwordHash.split(':')
        const providedPasswordHash = scryptSync(providedPassword, storedSalt, 64)
        const match = timingSafeEqual(providedPasswordHash, Buffer.from(storedPasswordHash, 'hex'))

        if (match) {
            done(null, user)
        } else {
            done(null, false, { message: 'Incorrect password' })
        }
    } catch (error) {
        done(error, false)
    }
}))

passport.serializeUser((user, done) => {
    return done(null, user.id)
})

passport.deserializeUser((id, done) => {
    try {
        return done(null, users.find(u => u.id === id))
    } catch (error) {
        done(error, null)
    }
})

module.exports = passport
