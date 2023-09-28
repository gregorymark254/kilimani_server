
const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema(
    {
        radio : { type:String, required:true,unique:false },
        title : { type:String, required:true,unique:false },
        message : { type:String, required:true,unique:false }
    },
    { timestamps : true }
)

module.exports = mongoose.model("Public Posts", UserSchema)