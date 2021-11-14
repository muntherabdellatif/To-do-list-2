const express =require("express");
const mongoose =require("mongoose");
let bodyParser =require("body-parser");
let cors =require("cors");
let path =require("path");
let expressLayouts =require("express-ejs-layouts");

const app =express();
let taskList=[];
let workTaskList=[];
let lastDayTitle="";

mongoose.connect("mongodb://localhost:27017/ToDoListDB",{useNewUrlParser:true});
mongoose.connect("mongodb://localhost:27017/LastDay",{useNewUrlParser:true});

const taskListSchema = new mongoose.Schema({
    name:{
        type:String ,
        required : [true] 
    },
});
const TaskList =mongoose.model("tasklist",taskListSchema);

const lastDaySchema = new mongoose.Schema({
    date:{
        type:String ,
        required : [true] 
    },
});
const LastDay =mongoose.model("lastday",lastDaySchema);

// default tasks
const task1 = new TaskList ({
    name: "Steel sport"
});
const task2 = new TaskList ({
    name: "Learn something new"
});
const task3 = new TaskList ({
    name: "Spend some time with the family"
});
let defaultTasks =[task1,task2,task3];

app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());
app.use(expressLayouts);
app.use(express.static(path.join(__dirname, 'public')));

app.set("views",path.join(__dirname,"views")); // set the file include ejs 
app.set("view engine","ejs");

app.get("/",function (req,res) {
    // update last day value from data base 
    LastDay.find(function (error,lastday) {
        if (error){
            console.log(error);
        }else {
            if (lastday.length>0){
                lastDayTitle=lastday[0].date;
            }
        }
    });
    //insert default tasks and taking data from data base
    TaskList.find(function (error,tasks) {
        if (error){
            console.log(error);
        }else {
            if (tasks.length===0){
                TaskList.insertMany(defaultTasks,function (err) {
                    if (err){console.log(err);}
                });
            }else {
                taskList=[];
                tasks.forEach((e)=>{
                    taskList.push(e.name);
                });
            }
        }
    });
    if (taskList.length===0){
        res.redirect("/");
    }
    // time data
    let today =new Date();
    let dayInMonth =today.getDate();
    let month =today.getMonth()+1;
    let year =today.getFullYear();
    let weekDays =["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    let day=weekDays[today.getDay()];
    let listTitle= `${day} To do list (${dayInMonth}/${month}/${year})`;
    if (lastDayTitle==="") { // if this is the first day you use 
        // first time you use data base (date )
        const NewDay= new LastDay ({
            date: listTitle
        });
        console.log("done");
        lastDayTitle=listTitle;
        NewDay.save();
    }else {
        if (lastDayTitle !== listTitle) { // this is a new day
            // clear all tasks in data base 
            TaskList.deleteMany({},function(er){
                if(er){
                    console.log(er);
                }
            })
            // update last date title 
            LastDay.updateOne({date:lastDayTitle},{date:listTitle},function(er){
                if(er){
                    console.log(er);
                }else {
                    console.log("done");
                }
            });
            lastDayTitle = listTitle ;
        }
    }
    // render
    res.render("index",{
        taskList:taskList ,
        listTitle:listTitle
    });   // read ejs file
});
app.post("/",function(req,res){
    console.log(req.body.button);
    let task =req.body.task;
    if (req.body.button===" Work To do list"){
        workTaskList.push(task);
        res.redirect("/work");
    }else {
        taskList.push(task);
        const newTask = new TaskList ({
            name: task
        });
        newTask.save();
        res.redirect("/");
    }
});
app.get("/work",function(req,res){
    res.render("index",{
        taskList:workTaskList ,
        listTitle:" Work To do list"
    });   // read ejs file
});
app.post("/work",function(req,res){
    
});
app.listen(process.env.PORT || 3000,function () {
    console.log("running");  
})