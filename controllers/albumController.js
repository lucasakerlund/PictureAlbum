"use strict";

const database = require('../models/dataHandler');

const remove_pictures = (req, res) => {
    database.removePictures(req.body.albumId, req.body.pictureIds, (err) => {
        res.json({ err });
    });
}

module.exports = {
    remove_pictures,
}