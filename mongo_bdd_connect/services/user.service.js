import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/config.js";
import { User } from "../models/user.model.js";
import { createError } from "../utils/helpers.js";
import jwt from "jsonwebtoken";

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

export async function login(userInput) {
    const {email, password} = userInput;
    const foundUser = await User.findOne({email})

    if(!foundUser){
        throw createError(401, "Identifiants Invalides");
    }
    const isMatch = await foundUser.comparePassword(password);

    if(!isMatch)        {
        throw createError(401, "Identifiants Invalides");
    }
    
const token = jwt.sign (
    {id: foundUser.id},
    JWT_SECRET,
    {expiresIn: JWT_EXPIRES_IN}
);


    return {foundUser, token}
}