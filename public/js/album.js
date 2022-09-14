"use strict";

let pictures;
let selectedPictures = [];
const closebutton = document.querySelector('.presentation-close');
const presentationTitle = document.querySelector('.presentation-title');
const presentation = document.querySelector('.presentation-container');
const presentationPicture = document.querySelector('.presentation-image-container img');
const previousButton = document.querySelector('.presentation-previous');
const nextButton = document.querySelector('.presentation-next');
const presentationButton = document.querySelector('.presentation-button');
const selectButtons = document.querySelectorAll('.tools .selected'); //Buttons to appear when images are selected

let index = 0;

closebutton.addEventListener('click', e => {
    closePresentation();
});

window.addEventListener('keydown', e =>{ 
    if (e.key == "Escape") {
        closePresentation()
    }
})

document.addEventListener('click', e => {
    if(e.target.className == 'image'){
        if(e.ctrlKey){
            const container = e.target.closest('.image-container');
            if(container.classList.toggle('selected')){
                selectedPictures.push(JSON.parse(e.target.dataset.object));
            }else {
                selectedPictures = selectedPictures.filter(p => p.id != e.target.dataset.id);
            }
            if(selectedPictures.length > 0){
                selectButtons.forEach(button => button.style.display = 'inherit');
            }else {
                selectButtons.forEach(button => button.style.display = 'none');
            }
            return;
        }
        clearSelectedPictures();
        pictures = allPictures;
        index = pictures.map(p => p.id).indexOf(e.target.dataset.id);
        showImage(index);
    }else{
        if(e.target.className == 'album-content'){
            clearSelectedPictures();
        }
    }

    if(e.target.className == 'presentation-content'){
        closePresentation();
    }
});

presentationButton.addEventListener('click', e => {
    pictures = selectedPictures;
    showImage(index=0);
});

previousButton.addEventListener('click', e1 => {
    showImage(index-=1);
});

nextButton.addEventListener('click', e1 => {
    showImage(index+=1);
});

window.addEventListener('keydown', (event) => {
    if(event.key == "ArrowLeft"){
        if(index <= 0){
            return;
        }
        showImage(index-=1);
    }
    if(event.key == "ArrowRight"){
        if(index >= pictures.length-1){
            return;
        }
        showImage(index+=1);
    }
});

const showImage = index => {
    console.log('index ' + index);
    console.log(pictures);
    presentationPicture.src = ''; //needs to be reset inorder to avoid showing the previous image upon loading the new image
    presentationPicture.src = '../' + pictures[index].imgHiRes;
    presentationTitle.innerHTML = pictures[index].title;
    presentation.style.visibility = 'visible';
    console.log(presentationPicture.imgHiRes)

    console.log('PictureAlbum/data/pictures/' + pictures[index].imgHiRes)
    
    
    if(index > 0) {
        previousButton.style.visibility = 'inherit';
    }else {
        previousButton.style.visibility = 'hidden';
    }

    if(index < pictures.length-1) {
        nextButton.style.visibility = 'inherit';
    }else {
        nextButton.style.visibility = 'hidden';
    }
}



const closePresentation = () => {
    presentation.style.visibility = 'hidden';
}

const clearSelectedPictures = () => {
    selectButtons.forEach(button => button.style.display = 'none');
    document.querySelectorAll('.image-container.selected').forEach(element => element.classList.toggle('selected', false));
    pictures = [];
    selectedPictures = [];
}