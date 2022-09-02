"use strict";

const database = require('../models/dataHandler');

const get_albums = (req, res) => {
    database.getAlbums((err, albums) => res.json({ err, albums }));
}

module.exports = {
    get_albums,
}