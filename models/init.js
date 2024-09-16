const mongoose = require("mongoose");
const Boys = require("./boys.js");

main()
.then(res => console.log("Connected to DB"))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Flipcart');
}

 Boys.insertMany([{
    name: "Akshay",
    age :28,
    city : "Pune"
 },{
    name : " Nikhil",
    age: 26,
    city : "Shilaung"
 },{
    name : "Rahul",
    city : "Hydrabad"
 }]);
