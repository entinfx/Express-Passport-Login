/* Express */
const express = require('express')
const app = express()

/* Routes */
const redirectRoutes = require('./routes/redirect')
const userRoutes = require('./routes/users')

/* View engine */
app.set('view engine', 'ejs')

/* Server */
app.listen(3000, () => {
    console.log('Listening on localhost:3000...')
})

/* Middleware */
app.use(express.urlencoded({ extended: true }))

/* Respond to requests */
app.use('/', redirectRoutes)
app.use('/users', userRoutes)
