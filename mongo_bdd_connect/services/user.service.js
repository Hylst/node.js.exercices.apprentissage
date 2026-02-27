import { User } from "../models/user.model.js";

export async function getAllUsers(){
    const users = await User.find();

    if(users.length===0){
        throw createError(404,"Aucun utilisateur touvé.")
    }
    return users;
}