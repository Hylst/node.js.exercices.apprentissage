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

export async function getUserById(req,res,next) {
    try {
        const user = await userService.getUserById(req.params.id);
        res.status(200).json({
            message:"Utilisateur trouvé",
            user:user
        });
    }catch(error){
        next(error);
    }
}

export async function createUser(req,res,next) {
    try {
        const user = await userService.createUser(req.body);
        res.status(201).json({
            message:"Utilisateur créé avec succès",
            user:user
        });
    }catch(error){
        next(error);
    }
}

export async function updateUser(req,res,next) {
    try {
        const user = await userService.updateUser(req.params.id, req.body);
        res.status(200).json({
            message:"Utilisateur mis à jour avec succès",
            user:user
        });
    }catch(error){
        next(error);
    }
}

export async function deleteUser(req,res,next) {
    try {
        const user = await userService.deleteUser(req.params.id);
        res.status(200).json({
            message:"Utilisateur supprimé avec succès",
            user:user
        });
    }catch(error){
        next(error);
    }
}


export async function login(req,res,next) {
    try{
        const userInput = req.body;
        const {foundUser, token} = await userService.login(userInput);

        const userWithoutPassword = foundUser.toObject();
        delete userWithoutPassword.password;

        res.status(200).json({
            message:"Connexion réusie",
            token,
            user:userWithoutPassword
        })
    }catch(error){
        next(error);
    }
}