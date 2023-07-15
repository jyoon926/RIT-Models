const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Inserting User CREATE
router.post('/register', async (req, res, next) => {
  const user = new User(req.body);
  try {
    const savedUser = await user.save();
    console.log("Registered " + savedUser.username);
    res.json(savedUser);
  } catch (error) {
    next(error);
  }
});

// Get all users READ
router.get('/', async (req, res) => {
  User.find({}, function (err, users) {
    var userList = [];
    users.forEach(function (user) {
      user.password = undefined;
      userList.push(user);
    });
    res.send(userList);
  });
});

// Get user from username READ
router.get('/:username', async (req, res) => {
  User.find({}, function (err, users) {
    users.forEach(function (user) {
      if (user.username == req.params.username) {
        user.password = undefined;
        res.json(user);
      }
    });
  });
});

// Check if email exists
router.get('/exists/:email', async (req, res) => {
  User.findOne({ email: req.params.email }).then((result) => {
    if (null != result)
      res.json(true);
    else
      res.json(false);
  }).catch(error => next(error));
});

// Login, returns a token
router.post('/login', async (req, res, next) => {
  // Email and password are required for logging in
  if (!req.body.email || !req.body.password) {
    next(new Error(`Email or password is missing in body request: ${JSON.stringify(req.body)}`));
    return;
  }
  User.findOne({ email: req.body.email })
    .then((result) => {
      if (result && bcrypt.compareSync(req.body.password, result.password)) {
        const token = jwt.sign({ id: result._id }, 'secretkey');
        res.json({ "token": token, "username": result.username });
        console.log("Logged in to " + result.username);
      } else {
        res.sendStatus(401);
      }
    }).catch(error => next(error));
});

// Update User UPDATE
router.put('/:username', (req, res, next) => {
  User.updateOne({ username: req.params.username }, req.body).then((result) => {
    if (result.nModified === 0) {
      next(new Error(`Document could not be updated because username '${req.params.username}' does not exist!`));
    } else {
      res.json(result);
    }
  }).catch(error => next(error));
});

// Delete User DELETE
router.delete('/:username', (req, res, next) => {
  User.deleteOne({ username: req.params.username }).then((result) => {
    if (result.deletedCount === 0) {
      next(new Error(`Document could not be delete because username '${req.params.username}' does not exist!`));
    } else {
      res.sendStatus(200);
    }
  }).catch(error => next(error));
});

module.exports = router;