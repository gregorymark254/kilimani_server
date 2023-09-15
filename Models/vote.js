
const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema(
    {
        votequestion : { type:String, required:true,unique:false }
        message : { type:String, required:true,unique:false }
    },
    { timestamps : true }
)

module.exports = mongoose.model("Vote Questions", UserSchema)