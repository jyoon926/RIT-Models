const express = require('express');
const router = express.Router();
const multer = require('multer');

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

router.get('/:filename', async (req, res) => {
  res.sendFile(`/uploads/${req.params.filename}`, { root: '.' });
});

module.exports = router;