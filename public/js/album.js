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
const commentIcon = document.querySelector(".image-comment-icon");
const editIcon = document.querySelector(".edit-icon");
const showImageText = document.querySelector(".image-text-box");
const comment = document.querySelector(".image-text");
const save = document.querySelector(".save-box");

let index = 0;

closebutton.addEventListener('click', e => {
    closePresentation();
});

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
                presentationButton.style.visibility = 'inherit';
            }else {
                presentationButton.style.visibility = 'hidden';
            
            }
            return;
        }
        clearPresentation();
        pictures = allPictures;
        index = pictures.map(p => p.id).indexOf(e.target.dataset.id);
        showImage(index);
    }else{
        if(e.target.className == 'album-content'){
            clearPresentation();
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

const clearPresentation = () => {
    presentationButton.style.visibility = 'hidden';
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
    if(!showImageText.contains(e.target)) {
        showImageText.classList.remove('active');
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
})

//When clicking on editIcon and changing text
//when save button not pressed, show current text after clicking
//either on comment button, document or editicon without save.

save.addEventListener('click', () => {
    const text = comment.value;
    comment.disabled = true;
    showImageText.classList.remove('active2');
    save.style.display = 'none';
    fetch('/albums/updateComment', {
        method: 'PUT' ,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            id: pictures[index].id,
            comment: text
        })
    })
    .then(response => response.json())
    .then(data => {
        if(data.err){
            return;
        }
        pictures[index].comment = text;
     
    })
})


function disableEdit(e) {
    if(!showImageText.contains(e.target)) {
        showImageText.classList.remove('active2');
        currentComment();
        save.style.display = 'none';
    }
}

function currentComment() {
    comment.value = pictures[index].comment;
}

