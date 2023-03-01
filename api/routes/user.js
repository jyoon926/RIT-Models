const express = require('express');
const router = express.Router();
const _ = require('underscore');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const db = require('../config/db');
const bcrypt = require('bcrypt');

// Inserting User CREATE
router.post('/register', async (req, res, next) => {
    const user = new User(req.body);
    try {
        const savedUser = await user.save();
        console.log("Registered " + savedUser.email);
        res.json(savedUser);
    } catch(error) {
        next(error);
    }
});

// Get all users READ
router.get('/users', async (req, res) => {
    User.find({}, function(err, users) {
        var userList = [];
        users.forEach(function(user) {
            user.password = "";
            userList.push(user);
        });
        res.send(userList);
    });
});

// Get user from fullname READ
router.get('/:name', async (req, res) => {
    User.find({}, function(err, users) {
        var userList = [];
        users.forEach(function(user) {
            if (user.fullname == req.params.name) {
                res.json(user);
            }
        });
    });
});

// Login, returns a token
router.post('/login', async (req, res, next) => {
    // Email and password are required for logging in
    if (!req.body.email || !req.body.password) {
        next(new Error(`Email or password is missing in body request: ${JSON.stringify(req.body)}`));
        return;
    }
    User.findOne({email: req.body.email, password: req.body.password})
    .then(
        (result) => {
            if (result) {
                const token = jwt.sign({ id: result._id }, 'secretkey');
                res.json({"token": token, "name": result.fullname});
                console.log("Logged in to " + result.fullname);
            } else {
                res.sendStatus(401);
            }
        }
    ).catch(error => next(error));
});

// Update User UPDATE
router.put('/:id', (req, res, next) => {
    User.updateOne({_id: req.params.id}, req.body).then((result) => {
        if (result.nModified === 0) {
            next(new Error(`Document could not be updated because _id ${req.params.id} does not exist on User model`));
        } else {
            res.json(result);
        }
    }).catch(error => next(error));
});

// Delete User DELETE
router.delete('/:id', (req, res, next) => {
    User.deleteOne({_id: req.params.id}).then((result) => {
        if (result.deletedCount === 0) {
            next(new Error(`Document could not be delete because _id ${req.params.id} does not exist on User model`));
        } else {
            res.sendStatus(200);
        }
    }).catch(error => next(error));
});

module.exports = router;