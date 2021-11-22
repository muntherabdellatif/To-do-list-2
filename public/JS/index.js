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
// delete page 
const deleteBtn =document.querySelectorAll (".page i") ;
deleteBtn.forEach ((btn)=>{
    btn.addEventListener("click", function(){
        let deletedPageName =this.dataset.name;
        if (deletedPageName!==" "){
            window.location.pathname=(`/deletePage/${deletedPageName}`);
        }
    });
});
