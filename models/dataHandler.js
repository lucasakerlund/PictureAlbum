const fs = require('fs');

const albumsFile = './data/albums.json';
const picturesFile = './data/pictures.json';

const getAlbums = (callback) => {
    fs.readFile(albumsFile, (err, data) => {
        if(err){
            callback(err, {});
        }else {
            list = JSON.parse(data);
            callback(err, list);
        }
    });
};

const getAlbum = (id, callback) => {
    fs.readFile(albumsFile, (err, data) => {
        if(err){
            callback(err, {}, {});
        }else {
            let list = JSON.parse(data);
            let outputAlbum;
            list.forEach(album => {
                if(album.id == id){
                    outputAlbum = album;
                    return;
                }
            });
            if(typeof outputAlbum == 'undefined'){
                callback('album not found', {}, {});
            }else {
                getPicturesFromIds(outputAlbum.picture_ids, (err, pictures) => {
                    callback(false, outputAlbum, pictures);
                });
            }
        }
    });
};

const getPicture = (id, callback) => {
    fs.readFile(picturesFile, (err, data) => {
        if(err) {
            callback(err, {});
        }else {
            let list = JSON.parse(data);
            let returnPicture;
            list.forEach(picture => {
                if(picture.id == id){
                    returnPicture = picture;
                    return;
                }
            });
            callback(typeof returnPicture == 'undefined' ? 'picture not found' : false, returnPicture);
        }
    });
}

const getPicturesFromIds = (pictureIds, callback) => {
    fs.readFile(picturesFile, (err, data) => {
        if(err){
            callback(err, {});
        }else {
            let pictures = JSON.parse(data);
            let output = [];
            pictures.forEach(picture => {
                pictureIds.forEach(id => {
                    if(picture.id == id){
                        output.push(picture);
                        return;
                    }
                });
            });
            callback(typeof output == 'undefined' ? 'pictures not found' : false, output);
        }
    });
}

module.exports = {
    getAlbums,
    getAlbum,
    getPicture,
    getPicturesFromIds
}
