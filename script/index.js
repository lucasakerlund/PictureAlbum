let hamburgerMenu = document.getElementById("hamburger-menu");
let navbarMenu = document.querySelector(".navbar-menu");

console.log(navbarMenu);

hamburgerMenu.addEventListener('click', () => {
    hamburgerMenu.classList.toggle("active");
    navbarMenu.classList.toggle("active");
}); 