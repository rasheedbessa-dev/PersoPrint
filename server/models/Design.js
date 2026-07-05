const mongoose = require("mongoose");

const DesignSchema = new mongoose.Schema(
{
    name:{
        type:String,
        required:true
    },

    imageUrl:{
        type:String,
        required:true
    },

    category:{
        type:String,
        default:"General"
    }
},
{
    timestamps:true
});

module.exports = mongoose.model("Design",DesignSchema);