const mongoose = require("mongoose");

const boySchema = new mongoose.Schema({
    name: {
        type: String,
        required : true
    },
    age:{
        type: Number,
        min: 0,
        default : 18, 
    },
    city : String 
  });

  const Boy = mongoose.model('Boy', boySchema);
  module.exports = Boy;