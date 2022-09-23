"use strict";

const createContainer = document.querySelector('.create-container');
const createWindow = document.querySelector('.create-window');
const imageItem = document.getElementById('image-item-create-album');
const imageInput = document.getElementById('image-input-create-album');
const previewImageCreateAlbum = document.getElementById('preview-image-create-album');
const closeCreateAlbumButton = document.querySelector('.close-create-album');

const closeCreateAlbum = () => {
    createWindow.classList.toggle('active', false);
};

createContainer.addEventListener('click', (e) => {
    createWindow.classList.toggle('active');
});

window.addEventListener('click', e => {
    if(!e.target.closest('.create-window') && !e.target.closest('.create-container')){
        closeCreateAlbum();
    }
});

closeCreateAlbumButton.addEventListener('click', () => {
    closeCreateAlbum();
});

imageInput.addEventListener('change', () => {
    handleImageSelector(imageItem, previewImageCreateAlbum);
}, false);