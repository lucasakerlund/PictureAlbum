const express = require('express');
const albumsController = require('../controllers/albumsController');

const multer = require('multer');
const upload = multer({ dest: 'data/albumPictures' });

const router = express.Router();

router.get('/', albumsController.get_albums_index);
router.get('/:id', albumsController.get_album);
router.put('/updateComment', albumsController.update_comment);
router.post('/create', upload.single("image"), albumsController.create_album);


module.exports = router;