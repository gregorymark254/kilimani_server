
const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema(
    {
        fullName : { type:String, required:true,unique:false },
        email : { type:String, required:true,unique:true },
        phone : { type:String, required:true,unique:true },
        password : { type:String, required:true },
        isAdmin: { type: String, default: 'User' }
    },
    { timestamps : true, default: new Date() }
)

module.exports = mongoose.model("User logins", UserSchema)