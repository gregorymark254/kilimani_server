
const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema(
    {
        radio : { type:String, required:true,unique:false },
        title : { type:String, required:true,unique:false },
        message : { type:String, required:true,unique:false }
    },
    { timestamps : true, default: new Date() }
)

module.exports = mongoose.model("Public Posts", UserSchema)