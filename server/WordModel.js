import mongoose from "mongoose";
const wordSchema  = new mongoose.Schema({
    word:{type:String,required:true,unique:true},
    freq:{type:Number,default:1}
})
export default mongoose.model("Word",wordSchema)