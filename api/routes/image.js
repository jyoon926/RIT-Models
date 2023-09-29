const express = require('express');
const router = express.Router();
const multer = require('multer');
const User = require('../models/User');
const fs = require('fs');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only image formats are allowed!'));
    }
  }
}).single('file');

const multiple = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only image formats are allowed!'));
    }
  }
}).single('multiple', 50);

router.post('/uploadfile', function (req, res) {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      res.status(400).send(err.message);
    } else if (err) {
      res.status(400).send(err.message);
    }
    else {
      console.log(req.file.path);
      res.json({ "filename": req.file.filename });
    }
  })
});

router.post('/uploadmultiple', (req, res) => {
  multiple(req, res, (err) => {
    if (req.files) {
      req.files.forEach(file => {
        if (err instanceof multer.MulterError) {
          console.log(err)
        } else if (err) {
          console.log(err)
        }
        else {
          console.log(file.path)
        }
      });
    }
  })
});

router.get('/get/:filename', async (req, res) => {
  res.sendFile(`/uploads/${req.params.filename}`, { root: '.' });
});

router.get('/clean', (req, res) => {
  fs.readdir('./uploads/', function (err, files) {
    User.find({}, function (err, users) {
      let images = [];
      for (let user of users) {
        images = images.concat(user.photos);
      }
      const redundantFiles = files.filter(f => !images.includes(f));
      redundantFiles.forEach(f => {
        fs.unlinkSync('./uploads/' + f);
      });
      res.send(redundantFiles);
    });
  });
})

module.exports = router;