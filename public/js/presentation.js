
window.addEventListener('keydown', (event) => {
    if(event.key == "ArrowLeft"){
        let prevButton = document.querySelector(".previous a");
        try{
            window.location = prevButton.href;
        }catch {
            //No previous page
        }
    }
    if(event.key == "ArrowRight"){
        let nextButton = document.querySelector(".next a");
        try{
            window.location = nextButton.href;
        }catch {

        }
    }
});