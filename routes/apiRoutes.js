"use strict";

const express = require('express');
const apiController = require('../controllers/apiController.js');

const router = express.Router();

router.get('/albums', apiController.get_albums);

module.exports = router;