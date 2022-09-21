"use strict";

const imageInputLow = document.getElementById('image-input-low-upload');
const imageInputHigh = document.getElementById('image-input-high-upload');
const previewImageUpload = document.getElementById('preview-image-upload');
const imageItemLow = document.getElementById('image-item-low-upload');
const imageItemHigh = document.getElementById('image-item-high-upload');
const closeUploadButton = document.querySelector('.close-upload');

const select = document.querySelector('.custom-select select');

const closeUpload = () => {
    document.querySelector('.upload-window').classList.toggle('active', false);
};

window.addEventListener('click', e => {
    if(!e.target.closest('.upload-window') && e.target.className != "navbar-upload"){
        closeUpload();
    }
});

closeUploadButton.addEventListener('click', () => {
    closeUpload();
});

imageInputLow.addEventListener('change', () => {
    handleImageSelector(imageItemLow, previewImageUpload);
}, false);

imageInputHigh.addEventListener('change', () => {
    handleImageSelector(imageItemHigh, previewImageUpload);
}, false);

const handleImageSelector = (imageItem, preview) => {
    let imageInput = imageItem.querySelector('input');
    let uploadButton = imageItem.querySelector('.custom-image-input');

    if(!imageInput.files[0]){ //If the file is empty
        uploadButton.classList.toggle('uploaded', false);
        uploadButton.querySelector('img').src = '/upload-image.svg';
        uploadButton.querySelector('p').innerText = "Välj bild";
        imageItem.querySelector('.upload-image-text').innerText = 'Ingen fil har valts';

        preview.querySelector('img').src = '/image-preview.svg';
        return;
    }

    let file = imageInput.files[0];

    if(!(file.type == "image/png" || file.type == "image/jpeg")){
        alert("Only .png and .jpeg allowed.");
        imageInput.value = null;
        return;
    }

    imageItem.querySelector('.upload-image-text').innerText = file.name;

    uploadButton.classList.toggle('uploaded', true);
    uploadButton.querySelector('img').src = '/reupload-image.svg';
    uploadButton.querySelector('p').innerText = "Byt bild";

    if(FileReader){
        let fr = new FileReader();
        fr.onload = () => {
            preview.querySelector('img').src = fr.result;
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