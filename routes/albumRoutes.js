const express = require('express');
const albumController = require('../controllers/albumController');

const router = express.Router();

router.get('/', albumController.get_albums_index);
router.get('/:id', albumController.get_album);
router.put('/updateComment', albumController.update_comment);

module.exports = router;