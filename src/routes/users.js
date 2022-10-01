const express = require('express');
const User = require('../models/User');
const router = express.Router();

const user = require('../models/User');
const passport = require('passport');
const { request } = require('express');

router.get('/users/signin', (req, res) => {
    res.render('users/signin');
});

router.post('/users/signin', passport.authenticate('local', {
    successRedirect: '/notes',
    failureRedirect: '/users/signin',
    failureFlash: true
}));

router.get('/users/signup', (req, res) => {
    res.render('users/signup');
});

router.post('/users/signup', async (req, res) => {
    const { name, email, password, confirm_password } = req.body;
    const errors = [];
    if (password != confirm_password) {
        errors.push({ text: 'Password do not match' });
    }
    if (password.length < 4) {
        errors.push({ text: 'Password must be at least 4 characters' });
    }
    if (errors.length > 0) {
        res.render('users/signup', { errors, name, email, password, confirm_password });
    } else {
        const newUser = new User({ name, email, password });
        newUser.password = await newUser.encryptPassword(password);
        await newUser.save();
        req.flash('success_msg', 'You are registered');
        res.redirect('/users/signin');
    }

});

router.get('/users/logout', (req, res) => {
    req.logout(req.user, err => {
        if (err) return next(err);
    });
    res.redirect('/');
});

module.exports = router;