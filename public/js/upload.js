"use strict";

const imageInputLow = document.getElementById('image-input-low');
const imageInputHigh = document.getElementById('image-input-high');
const previewImageContainer = document.querySelector('.preview-image');
const imageItemLow = document.getElementById('image-item-low');
const imageItemHigh = document.getElementById('image-item-high');

const select = document.querySelector('.custom-select select');

imageInputLow.addEventListener('change', () => {
    handleImageSelector(imageItemLow);
}, false);

imageInputHigh.addEventListener('change', () => {
    handleImageSelector(imageItemHigh);
}, false);

const handleImageSelector = (imageItem) => {
    let imageInput = imageItem.querySelector('input');
    let uploadButton = imageItem.querySelector('.custom-image-input');

    if(!imageInput.files[0]){ //If the file is empty
        uploadButton.classList.toggle('uploaded', false);
        uploadButton.querySelector('img').src = '/upload-image.svg';
        uploadButton.querySelector('p').innerHTML = "Välj bild";
        imageItem.querySelector('.upload-image-text').innerHTML = 'Ingen fil har valts';

        previewImageContainer.querySelector('img').src = '/image-preview.svg';
        return;
    }

    let file = imageInput.files[0];
    imageItem.querySelector('.upload-image-text').innerHTML = file.name;

    uploadButton.classList.toggle('uploaded', true);
    uploadButton.querySelector('img').src = '/reupload-image.svg';
    uploadButton.querySelector('p').innerHTML = "Byt bild";

    if(FileReader){
        let fr = new FileReader();
        fr.onload = () => {
            previewImageContainer.querySelector('img').src = fr.result;
        }
        fr.readAsDataURL(file);
    }
}

//Get Albums
(function() {
    fetch("/api/albums")
    .then(response => response.json())
    .then(data => {
        if(data.err){
            console.log(data.err);
        }else {
            data.albums.forEach(album => {
                let option = document.createElement('option');
                option.value = album.id;
                option.innerHTML = album.title;
                select.appendChild(option);
            });
        }
    });
})();