import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema (
    {
        nom:{
            type:String,
            required:true,
            trim:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            trim:true
        },
        password:{
            type:String,
            required:true,
            trim:true
        }
    },
    {
        timestamps:true
    }
)

userSchema.pre("save", async function (){
    if(!this.isModified("password")) { return }
    const saltRounds = 14;

    this.password = await bcrypt.hash(this.password, saltRounds);
})

userSchema.methods.comparePassword = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

export const User =  mongoose.model("User", userSchema)