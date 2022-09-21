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
<<<<<<< HEAD
const downloadbutton = document.getElementById('downloadbtnjs');
const downloadPanel = document.getElementById('popup');
=======
const commentIcon = document.querySelector(".image-comment-icon");
const editIcon = document.querySelector(".edit-icon");
const showImageText = document.querySelector(".image-text-box");
const comment = document.querySelector(".image-text");
const save = document.querySelector(".save-box");
const selectButtons = document.querySelectorAll('.tools .selected'); //Buttons to appear when images are selected
>>>>>>> 61f05c8d1c06e3828cde4fb031d4bd895ac0d760

let index = 0;

closebutton.addEventListener('click', e => {
    closePresentation();
    
});

window.addEventListener('keydown', e =>{ 
    if (e.key == 'Escape') {
        if(downloadPanel.classList.length > 1 && presentation.style.visibility == 'visible'){
            downloadbutton.click();
            closePresentation();
        }else if(downloadPanel.classList.length == 1 && presentation.style.visibility == 'visible'){
            closePresentation();
        }
    }
})

downloadbutton.addEventListener('click', e =>{
    downloadPanel.classList.toggle('.popup-toggle')
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
    comment.innerHTML = pictures[index].comment;
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

/**Text-box for image is hidden when clicking outside the box */
document.addEventListener('click', hideBox );

commentIcon.addEventListener('click', (e) => {
    if(showImageText.classList.toggle('active')){
        e.stopPropagation();
        comment.disabled = 'true';
        presentationPicture.style.opacity = 0.65;
    }else{
        currentComment();
        presentationPicture.style.opacity = 1;
    }
})

function hideBox(e) {
    if(!showImageText.contains(e.target) && !presentationTitle.contains(e.target)) {
        showImageText.classList.remove('active');
        presentationTitle.classList.remove('active3');
        presentationPicture.style.opacity = 1;
    }
}

document.addEventListener('click', disableEdit);

editIcon.addEventListener('click', (e) => {
    if(showImageText.classList.toggle('active2')){
        e.stopPropagation();
        comment.disabled = false;
        save.style.display = 'block';
    } else {
        save.style.display = 'none';
        currentComment();
        comment.disabled = true;
    }
    if(presentationTitle.classList.toggle('active3')){
        e.stopPropagation();
        presentationTitle.contentEditable = 'true';
    }else{
        presentationTitle.contentEditable = 'false';
    }
})



save.addEventListener('click', () => {
    const text = comment.value;
    const newTitle = presentationTitle.innerHTML;
    comment.disabled = true;
    showImageText.classList.remove('active2');
    presentationTitle.classList.remove('active3');
    save.style.display = 'none';
    fetch('/albums/updateComment', {
        method: 'PUT' ,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            id: pictures[index].id,
            comment: text,
            title: newTitle
        })
    })
    .then(response => response.json())
    .then(data => {
        if(data.err){
            return;
        }
        pictures[index].comment = text;
        pictures[index].title = newTitle;

    })
})


function disableEdit(e) {
    if(!showImageText.contains(e.target) && !presentationTitle.contains(e.target)) {
        showImageText.classList.remove('active2');
        presentationTitle.classList.remove('active3');
        
        presentationTitle.contentEditable = 'false';
        comment.disabled = true;
        
        presentationTitle.innerHTML = pictures[index].title;
        currentComment();
        save.style.display = 'none';
    }
}

function currentComment() {
    comment.value = pictures[index].comment;
}

