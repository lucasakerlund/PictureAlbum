"use strict";

const hamburgerMenu = document.getElementById("hamburger-menu");
const navbarMenu = document.querySelector(".navbar-menu");
const navUploadButton = document.querySelector('.navbar-upload');
const uploadWindow = document.querySelector('.upload-window');

navUploadButton.addEventListener('click', () => {
    uploadWindow.classList.toggle('active');
});

hamburgerMenu.addEventListener('click', () => {
    hamburgerMenu.classList.toggle("active");
    navbarMenu.classList.toggle("active");
}); 