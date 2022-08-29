const express = require('express');
const albumController = require('../controllers/albumController');

const router = express.Router();

router.get('/', albumController.get_albums_index);
router.get('/presentation/:album', (req, res) => {
    res.redirect(`/albums/presentation/${req.params.album}/0`);
});
router.get('/presentation/:album/:page', albumController.get_presentation);
router.get('/:id', albumController.get_album);

module.exports = router;