const database = require('../models/dataHandler');

const get_albums_index = (req, res) => {
    database.getAlbums((err, albums) => {
        if(err) {
            console.log(err);
        }
        res.render('albums/index', { title: 'Albums', albums, ratingAlbums: database.ratingAlbums});
    });
}

const get_album = (req, res) => {
    database.getAlbum(req.params.id, (err, album, pictures) => {
        if(err){
            console.log(err);
            res.status(404).render('404', { title: 'No album found', message: 'Could not find the album.' });
        }else {
            res.render('albums/album', { title: 'Album', album, pictures });
        }
    });
}

const update_comment = (req, res) => {
    database.updateComment(req.body.id, req.body.comment, (err) => {
        res.json({ err });
    });
}

module.exports = {
    get_albums_index,
    get_album,
    update_comment
}