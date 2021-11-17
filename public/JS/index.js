// change the page 
const pageTitles = document.querySelectorAll(".pages_box .page p");
const pageTitlesBox = document.querySelectorAll(".pages_box .page ");
pageTitles.forEach ((PT)=>{
    PT.addEventListener("click", function(){
        pageTitlesBox.forEach (p=>{
            p.classList.remove("active");
        });
        pageNumber = this.dataset.num;
        pageTitlesBox[pageNumber].classList.add("active");
        window.location.pathname=(`/changePage/${pageNumber}`);
    });
});