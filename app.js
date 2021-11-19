const express =require("express");
const mongoose =require("mongoose");
let bodyParser =require("body-parser");
const mongoose =require("mongoose");
let cors =require("cors");
let path =require("path");
let expressLayouts =require("express-ejs-layouts");
mongoose.connect("mongodb://localhost:27017/ToDoListDB",{useNewUrlParser:true});

const PageTasksSchema = new mongoose.Schema({
    taskName : String 
});
const pageTasks =mongoose.model("pageTasks",PageTasksSchema);

const PagesListSchema = new mongoose.Schema({
    _id : Number ,
    name:String,
    tasksList: [{type:PageTasksSchema}]
});
const PagesList =mongoose.model("PagesList",PagesListSchema);

const app =express();
let pagesTitles=[];
let currentPage=0;

let pages = [];

//find element in data base and push it in pages array 
PagesList.find(function (error,ToDoListData) {
    if (error){
        console.log(error);
    }else {
        if (ToDoListData){
            ToDoListData.forEach((page)=>{
                console.log(page.name);
                console.log(page.tasksList);
                const newPage = {
                    pageTitle :page.name ,
                    tasks :page.tasksList
                }
                pages.push(newPage);
                pagesTitles.push(page.name );
            })
        }
    }
});

app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());
app.use(expressLayouts);
app.use(express.static(path.join(__dirname, 'public')));

app.set("views",path.join(__dirname,"views")); // set the file include ejs 
app.set("view engine","ejs");

app.get("/",function (req,res) {
    if (pages.length===0){
        res.render("index",{
            currentpageTitle:"welcome in To Do List",
            currentPageTasks:[],
            pagesTitles:[] 
        });   // read ejs file
    }else{
        res.render("index",{
            currentpageTitle:pages[currentPage].pageTitle,
            currentPageTasks:pages[currentPage].tasks,
            pagesTitles:pagesTitles 
        });   // read ejs file
    }
});
app.post("/addtask",function(req,res){
    let addToPage = req.body.button;
    for(var n of pages){
        if(n.pageTitle===addToPage){
            n.tasks.push({taskName:req.body.task});
        }
    }

    // adding tasks to data base 
    const NewTask = new pageTasks ({
        taskName : req.body.task 
    });
    NewTask.save();

    // adding task to page in data base 
    PagesList.findOneAndUpdate(
       { _id: currentPage}, 
       { $push: { tasksList: [ {taskName: req.body.task} ] } },
      function (error, success) {
            if (error) {
                console.log(error);
            } else {
            }
        });
    res.redirect("/");
});
app.post("/addPage",function(req,res){
    let newPage={
            pageTitle:req.body.page,
            tasks:[]
        };
    pages.push(newPage);
    pagesTitles.push(req.body.page);

    // adding page to data base 
    const newPageDB = new PagesList ({
        _id : pages.length-1 ,
        name:req.body.page ,
    }) ;
    newPageDB.save();

    // change current page to new page
    currentPage=pages.length-1;

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