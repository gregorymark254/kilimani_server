
const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema(
    {
        subject : { type:String, required:true,unique:false },
        description : { type:String, required:true,unique:true },
    },
    { timestamps : true }
)

module.exports = mongoose.model("Blogs", UserSchema)