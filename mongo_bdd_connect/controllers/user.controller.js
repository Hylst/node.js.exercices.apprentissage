import * as userService from "../services/user.service.js"

export async function getAllUsers(req,res,next) {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json({
            message:"Voici la liste des utilisateurs",
            liste:users
        });
    }catch(error){
        next(error);
    }

}