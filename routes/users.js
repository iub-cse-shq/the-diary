const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

module.exports = router;

//User Login route
router.get('/login', (req, res)=>{
    res.render('users/login');
});
//User Register Route
router.get('/register', (req, res)=>{
    res.send('Register');
});