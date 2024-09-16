const express = require("express");
const app = express();
const Boys = require("./models/boys.js");
var methodOverride = require('method-override')
const mongoose = require('mongoose');
const path = require('path');
const ejsMate = require('ejs-mate');
const ExpressError = require("./ExpressError.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride('_method'))
app.engine('ejs', ejsMate);

main()
.then(res => console.log("Connected to DB"))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Flipcart');
}
app.get("/",(req,res)=>{
    res.send("<h1>Home Page</h1>")
});


//INdex Route
app.get("/boys",async(req,res)=>{
    const boys = await Boys.find({});
    res.render("index.ejs",{boys});
});

//New Route 
app.get("/boys/new",(req,res)=>{
    // throw new ExpressError(404,"Page Not Found")
    res.render("new.ejs");
})
// create Route
app.post("/boys",async(req,res,next)=>{
    try{
        let {name,age,city}= req.body;
        let boy = new Boys ({
            name :name,
            age:age,
            city:city
        })
        await  boy.save();
        res.redirect("/boys");
    }
    catch(err){
        next(err);
    }
  
});
function asyncWrap(fn){
    return function(req,res,next){
        fn(req,res,next).catch((err)=>{
            next(err);
        })
    }
}
// Show Route 
app.get("/boys/:id",asyncWrap (async(req,res,next)=>{
   
        let {id} = req.params;
        let boy =await Boys.findById(id);
        if(!boy){
           next(new ExpressError(404, "Chat Not Found"));
        }
        res.render("show.ejs",{boy});
}));
//Edit Route
app.get("/boys/:id/edit",async(req,res)=>{
    let {id}= req.params;
    let boy =await Boys.findById(id);
    res.render("edit.ejs",{boy});
});

app.put("/boys/:id",async(req,res)=>{
    let {id}= req.params;
   let boyUpdate=await Boys.findByIdAndUpdate(id,{...req.body.boy},{new :true});
   res.redirect("/boys");
})



app.delete("/boys/:id",async (req,res)=>{
    let {id}= req.params;
    let deleteData =await  Boys.findByIdAndDelete(id);
    res.redirect("/boys");
})

const HandleValidationErr = (err)=>{
    console.log("This Was Validation Error Please Follow Rules");
    console.dir(err.message);
    return err;
}
//mongoose Error
app.use((err,req,res,next)=>{
    console.log(err.name);
    if(err.name === "ValidationError"){
      HandleValidationErr(err);
    }
    next(err);
})
//Handling Error
app.use((err,req,res,next)=>{
    let {status=500, message="Some Error Occured "}= err;
    res.status(status).send(message);
})

app.listen(8080,()=>{
    console.log(`port is listening on 8080`);
})