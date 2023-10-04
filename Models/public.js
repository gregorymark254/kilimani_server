
const mongoose = require("mongoose")

const CommentSchema = new mongoose.Schema(
    {
        reply: { type: String, required: true },
    }, 
    { timestamps: true }
);

const UserSchema = new mongoose.Schema(
    {
        radio : { type:String, required:true,unique:false },
        title : { type:String, required:true,unique:false },
        message : { type:String, required:true,unique:false },
        likes: { type: Number, default: 0 }, // Add a field to track likes
        comments: [CommentSchema]
    },
    { timestamps : true }
)

module.exports = mongoose.model("Public Posts", UserSchema)