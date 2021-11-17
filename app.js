const express =require("express");
let bodyParser =require("body-parser");
let cors =require("cors");
let path =require("path");
let expressLayouts =require("express-ejs-layouts");

const app =express();
let pagesTitles=[];
let currentPage=1;
let pages = [
    {
        pageTitle:"To do list page 1",
        tasks:[
            "task1" ,
            "task2"
        ]
    },
    {
        pageTitle:"To do list page 2",
        tasks:[
            "task3" ,
            "task4"
        ]
    }
];

app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());
app.use(expressLayouts);
app.use(express.static(path.join(__dirname, 'public')));

app.set("views",path.join(__dirname,"views")); // set the file include ejs 
app.set("view engine","ejs");

app.get("/",function (req,res) {
    if (pagesTitles.length!==pages.length) {
        pagesTitles=[];
        for(i=0;i<pages.length;i++){
            pagesTitles.push(pages[i].pageTitle);
        }
    }
    res.render("index",{
        currentpageTitle:pages[currentPage].pageTitle,
        currentPageTasks:pages[currentPage].tasks,
        pagesTitles:pagesTitles
    });   // read ejs file
});
app.post("/addtask",function(req,res){
    let addToPage = req.body.button;
    for(var n of pages){
        if(n.pageTitle===addToPage){
            n.tasks.push(req.body.task);
        }
    }
    res.redirect("/");
});
app.post("/addPage",function(req,res){
    let newPage={
            pageTitle:req.body.page,
            tasks:[]
        };
    pages.push(newPage);
    res.redirect("/");
});
app.get(`/changePage/:postID`,function (req,res) {
    currentPage = req.params.postID;
    res.redirect("/");
  });
app.post("/",function(req,res){

});
app.listen(process.env.PORT || 3000,function () {
    console.log("running");  
});