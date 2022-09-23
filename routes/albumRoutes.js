"use strict";

const express = require('express');
const albumController = require('../controllers/albumController');

const multer = require('multer');

const router = express.Router();

router.post('/removePictures', albumController.remove_pictures);


module.exports = router;