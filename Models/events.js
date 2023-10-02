
const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema(
    {
        image : { data: Buffer, type:String, required:false, unique:false },
        date : { type:String, required:true,unique:false },
        title : { type:String, required:true,unique:false },
        location : { type:String, required:true,unique:false },
        about : { type:String, required:true,unique:true }
    },
    { timestamps : true }
)

module.exports = mongoose.model("Events", UserSchema)