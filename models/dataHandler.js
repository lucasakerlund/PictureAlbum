"use strict";

const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const { json } = require('express');

const albumsFile = './data/albums.json';
const picturesFile = './data/pictures.json';

const ratingAlbums = [
    {
        id: 'one-star',
        title: 'One star ratings',
        image: '1-star-rating-album.svg',
        rating: 1
    },
    {
        id: 'two-stars',
        title: 'Two star ratings',
        image: '2-star-rating-album.svg',
        rating: 2
    },
    {
        id: 'three-stars',
        title: 'Three star ratings',
        image: '3-star-rating-album.svg',
        rating: 3
    },
    {
        id: 'four-stars',
        title: 'Four star ratings',
        image: '4-star-rating-album.svg',
        rating: 4
    },
    {
        id: 'five-stars',
        title: 'Five star ratings',
        image: '5-star-rating-album.svg',
        rating: 5
    },
]



const getAlbums = (callback) => {
    fs.readFile(albumsFile, (err, data) => {
        if(err){
            callback(err, []);
        }else {
            let list = JSON.parse(data);
            callback(err, list);
        }
    });
};

const getAlbum = (id, callback) => {

    const ratingAlbum = ratingAlbums.filter(album => album.id == id)[0];

    if(typeof ratingAlbum !== 'undefined'){
        fs.readFile(picturesFile, (err, data) => {
            if(err){
                callback('couldnt read pictures', ratingAlbum, {});
                return;
            }
            let list = JSON.parse(data);
            let outputPictures = [];
            list.forEach(picture => {
                if(picture.rating == ratingAlbum.rating){
                    outputPictures.push(picture);
                }
            });
            callback(false, ratingAlbum, outputPictures);
        });
        return;
    }else {
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
    }
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

const uploadPicture = (title, comment, imgLoRes, imgHiRes, rating, albumIds, callback) => {
    fs.readFile(picturesFile, (err, data) => {
        if(err){
            console.log(err);
            return false;
        }
        let list = JSON.parse(data);
        const pictureId = crypto.randomUUID();
        list.push({
            "id": pictureId,
            title,
            comment,
            imgLoRes,
            imgHiRes,
            rating
        });
        fs.writeFile(picturesFile, JSON.stringify(list, null, 2), (err) => {
            if(err) {
                console.log(err);
                return false;
            }
        });

        fs.readFile(albumsFile, (err, data) => {
            if(err){
                console.log(err);
                return false;
            }
            let albums = JSON.parse(data);
            //Adding picutreId to all albums
            if(Array.isArray(albumIds)){
                albums.forEach(album => {
                    albumIds.forEach(id => {
                        if(album.id == id){
                            album.picture_ids.push(pictureId);
                        }
                    });
                });
            }else {
                albums.filter(album => album.id == albumIds)[0].picture_ids.push(pictureId);
            }
            //
            fs.writeFile(albumsFile, JSON.stringify(albums, null, 2), (err) => {
                if(err){
                    console.log(err);
                    return false;
                }
                return true;
            });
        });
    });
}

const updateComment = (pictureId, comment, callback) => {
    fs.readFile(picturesFile, (err, data) => {
        if(err){
            callback("Could not retrieve pictures");
            return;
        }
        let pictures = JSON.parse(data);
        pictures.forEach(picture => {
            if(picture.id == pictureId){
                picture.comment = comment;
                return;
            }
        });
        fs.writeFile(picturesFile, JSON.stringify(pictures, null, 2), (err) => {
            if(err){
            callback("Could not save pictures");
            return;
            }
            callback(false);
        });
    });
}

const createAlbum = (title, description, img, callback) => {
    fs.readFile(albumsFile, (err, data) => {
        if(err){
            callback("Could not read albums file.");
            return;
        }
        let list = JSON.parse(data);
        list.push({
            "id": crypto.randomUUID(),
            title,
            description,
            "image": img,
            "picture_ids": [] 
        });
        fs.writeFile(albumsFile, JSON.stringify(list, null, 2), (err) => {
            if(err){
                callback("Could not save the created album.");
                return;
            }
            callback(false);
        });
    });
}

/**
 * 
 * @param {*} pictureIds
 * Takes in a list of picture ids and if the id doesnt exist in at least one album it will get removed.
 */
const removeUnusedPictures = (pictureIds) => {
    fs.readFile(albumsFile, (err, data) => {
        if(err) {
            console.log(err);
            return;
        }
        let albumList = JSON.parse(data);
        fs.readFile(picturesFile, (err, data) => {
            if(err) {
                console.log(err);
                return;
            }

            let pictureList = JSON.parse(data);

            pictureIds.forEach(pictureId => {
                for(let i = 0; i < albumList.length; i++){
                    if(albumList[i].picture_ids.includes(pictureId)) {
                        return;
                    }
                }
                let pictureToRemove = pictureList.filter(picture => picture.id == pictureId)[0];
                fs.unlinkSync('./data/pictures/' + pictureToRemove.imgLoRes);
                fs.unlinkSync('./data/pictures/' + pictureToRemove.imgHiRes);
                pictureList = pictureList.filter(picture => picture.id != pictureId);
            });
            fs.writeFile(picturesFile, JSON.stringify(pictureList, null, 2), (err) => {
                if(err) {
                    console.log(err);
                }
            });
        });
    });
}

const removePictures = (albumId, pictureIds, callback) => {
    fs.readFile(albumsFile, (err, data) => {
        if(err){
            callback("Could not read albums file.");
            return;
        }
        let list = JSON.parse(data);

        list.forEach(album => {
            if(album.picture_ids.in){

            }
            if(album.id == albumId){
                album.picture_ids = album.picture_ids.filter(pictureId => !pictureIds.includes(pictureId));
            }
        })

        fs.writeFile(albumsFile, JSON.stringify(list, null, 2), err => {
            if(err){
                callback("Could save the albums file.");
                return;
            }
            callback(false);
        });

        removeUnusedPictures(pictureIds);
    });
}

module.exports = {
    ratingAlbums,
    getAlbums,
    getAlbum,
    getPicture,
    getPicturesFromIds,
    uploadPicture,
    updateComment,
    createAlbum,
    removePictures,
}
