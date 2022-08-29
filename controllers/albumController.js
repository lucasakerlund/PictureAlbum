const database = require('../models/dataHandler');

const get_albums_index = (req, res) => {
    database.getAlbums((err, albums) => {
        if(err) {
            console.log(err);
        }
        res.render('albums/index', { title: 'Albums', albums});
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

const get_presentation = (req, res) => {
    database.getAlbum(req.params.album, (err, album, pictures) => {
        if(err){
            console.log(err);
            res.status(404).render('404', { title: 'No album found', message: 'Could not find the album.' });
        }else {
            if(req.params.page >= pictures.length || !(typeof req.params.page == 'number' || !isNaN(Number(req.params.page)))){
                res.status(404).render('404', { title: 'No picture found', message: 'Could not find the picture.' });
                return;
            }
            res.render('albums/presentation', { title: album.title, album, pictures, page: req.params.page });
        }
    });
}

module.exports = {
    get_albums_index,
    get_album,
    get_presentation
}