import { User } from "../models/user.model.js";
import { createError } from "../utils/helpers.js";

export async function getAllUsers(){
    const users = await User.find();

    if(users.length===0){
        throw createError(404,"Aucun utilisateur touvé.")
    }
    return users;
}

export async function getUserById(id){
    const user = await User.findById(id);
    
    if(!user){
        throw createError(404,"Utilisateur non trouvé");
    }
    
    return user;
}

export async function createUser(userData){
    const user = new User(userData);
    return await user.save();
}

export async function updateUser(id, userData){
    const user = await User.findByIdAndUpdate(id, userData, { new: true });
    
    if(!user){
        throw createError(404,"Utilisateur non trouvé");
    }
    
    return user;
}

export async function deleteUser(id){
    const user = await User.findByIdAndDelete(id);
    
    if(!user){
        throw createError(404,"Utilisateur non trouvé");
    }
    
    return user;
}
