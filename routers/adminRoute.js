const express = require('express')
const router = express.Router()

const { check } = require('express-validator')

const { login } = require('../controllers/authController')

// Login route for admin 
router.post(
    '/login',

    check('email')
        .isEmail()
        .withMessage('Enter a valid email')
        .normalizeEmail(),
    check('password')
        .not()
        .isEmpty()
        .isLength({min: 8})
        .withMessage('Password length is at least 8 character'),

    login
)

module.exports = router