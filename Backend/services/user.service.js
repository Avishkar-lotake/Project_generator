import userModel from '../models/user.model.js';
import mongoose from 'mongoose';


export const createUser = async ({
    email, password
}) => {

    if (!email || !password) {
        throw new Error('Email and password are required');
    }

    const hashedPassword = await userModel.hashPassword(password);

    const user = await userModel.create({
        email,
        password: hashedPassword
    });

    return user;

}

export const getAllUsersByID = async ({userId})=>{
    if(!userId){
        throw new Error ("UserId not found")
    }
    if(!mongoose.Types.ObjectId.isValid(userId)){
        throw new Error("userId is wrong")
    }
    const AllUsers = await userModel.find({_id : {$ne:userId}})
    return AllUsers
}
