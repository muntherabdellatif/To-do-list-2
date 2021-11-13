const express =require("express");
let bodyParser =require("body-parser");
let cors =require("cors");
let path =require("path");
let expressLayouts =require("express-ejs-layouts");

const app =express();
let taskList=[];
let workTaskList=[];

app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());
app.use(expressLayouts);
app.use(express.static(path.join(__dirname, 'public')));

app.set("views",path.join(__dirname,"views")); // set the file include ejs 
app.set("view engine","ejs");

app.get("/",function (req,res) {
    let today =new Date();
    let hour =today.getHours();
    let dayHalf= "AM"
    if (hour >12){ hour -=12; timeInDay="PM";
    }else{ timeInDay="AM";}
    let min =today.getMinutes();
    let dayInMonth =today.getDate();
    let month =today.getMonth();
    let year =today.getFullYear();
    let weekDays =["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    let day=weekDays[today.getDay()];
    let listTitle= `${day} To do list (${dayInMonth}/${month}/${year})`;
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
        console.log("ok")
    }else {
        taskList.push(task);
        res.redirect("/");
        console.log(":(");
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