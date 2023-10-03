
const mongoose = require("mongoose")

const CommentSchema = new mongoose.Schema(
    {
        text: { type: String, required: true },
    }, 
    { timestamps: true }
);

const UserSchema = new mongoose.Schema(
    {
        subject : { type:String, required:true,unique:false },
        description : { type:String, required:true,unique:true },
        comments: [CommentSchema]
    },
    { timestamps : true }
)

module.exports = mongoose.model("Blogs", UserSchema)