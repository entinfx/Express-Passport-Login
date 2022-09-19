const express = require('express')
const router = express.Router()

router.get('/signup', (req, res) => res.redirect('/users/signup'))
router.get('/login', (req, res) => res.redirect('/users/login'))

module.exports = router
