const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema(
    {
        email : { type:String, required:true, unique:false },
        proposal : { type:String, required:true, unique:false },
        description : { type:String, required:true, unique:false },
        file : { data: Buffer, type:String, required:false, unique:false },
    },
    { timestamps : true }
)

module.exports = mongoose.model("Help Question", UserSchema)