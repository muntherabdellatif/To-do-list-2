const express =require("express");
const mongoose =require("mongoose");
let bodyParser =require("body-parser");
let cors =require("cors");
let path =require("path");
let expressLayouts =require("express-ejs-layouts");
mongoose.connect("mongodb://localhost:27017/ToDoListDB",{useNewUrlParser:true});

const PageTasksSchema = new mongoose.Schema({
    taskName : String 
});
const pageTasks =mongoose.model("pageTasks",PageTasksSchema);

const PagesListSchema = new mongoose.Schema({
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
    const NewTask = new pageTasks ({
        taskName : req.body.task ,
    });
    NewTask.save();

    // adding task to page in data base 
    PagesList.findOneAndUpdate(
       { name: pages[currentPage].pageTitle}, 
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
    if (req.body.page!==""){
        let newPage={
            pageTitle:req.body.page,
            tasks:[]
        };
        pages.push(newPage);
        pagesTitles.push(req.body.page);

        // adding page to data base 
        const newPageDB = new PagesList ({
            // _id : pages.length-1 ,
            name:req.body.page ,
        }) ;
        newPageDB.save();

        // change current page to new page
        currentPage=pages.length-1;
    }
    res.redirect("/");
});
app.post("/changeStatus",function(req,res){
    // delete from tasks 
    pageTasks.findOneAndDelete(
        {taskName:req.body.checkbox} ,
        function (error, success) {
            if (error) {
                console.log(error);
            } else {
            }
        }
    );
    // delete from page
    console.log(pages[currentPage].pageTitle);
    console.log(req.body.checkbox);
    PagesList.findOneAndUpdate(
        {name:pages[currentPage].pageTitle} ,
        {$pull:{tasksList:{taskName:req.body.checkbox}}} ,
        function (error,success) {
            if (error) {
                console.log(error);
            } else {
            }
        }
    );
    // delete from pages array
    for (let i=0 ;i<pages[currentPage].tasks.length;i++){
        if (pages[currentPage].tasks[i].taskName === req.body.checkbox) {
            pages[currentPage].tasks.splice(i,1);
        }
    }
    // users[userID].projects.splice(toDeleteProject,1);

    res.redirect("/");
})
app.get(`/changePage/:postID`,function (req,res) {
    currentPage = req.params.postID;
    res.redirect("/");
  });
app.get(`/deletePage/:postID`,function (req,res) {
    console.log(req.params.postID);
    // delete from data base
    PagesList.findOneAndDelete(
        {name:req.params.postID} ,
        function (error, success) {
            if (error) {
                console.log(error);
            } else {
            }
        }
    );
    // delete from pages array
    let counter =0;
    pages.forEach((p)=>{
        if (p.pageTitle===req.params.postID) {
            pages.splice(counter,1);
            pagesTitles.splice(counter,1);
        }
        counter++;
    });
    console.log(pages);
    currentPage=pages.length-1;
    res.redirect("/");
  });
app.post("/",function(req,res){

});
app.listen(process.env.PORT || 3000,function () {
    console.log("running");  
});