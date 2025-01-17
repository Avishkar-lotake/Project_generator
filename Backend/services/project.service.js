import mongoose from 'mongoose';
import projectModel from '../models/project.model.js';


export const createProject = async ({
    name, userId
}) => {
    if (!name) {
        throw new Error('Name is required')
    }
    if (!userId) {
        throw new Error('UserId is required')
    }

    let project;
    try {
        project = await projectModel.create({
            name,
            users: [ userId ]
        });
    } catch (error) {
        if (error.code === 11000) {
            throw new Error('Project name already exists');
        }
        throw error;
    }

    return project;

}
// export const createProject = async(
//     name ,userId
// )=>{
//     if(!name){
//         throw new Error("name is required")
//     }
//     if(!userId){
//         throw new Error("userId is required")
//     }
        
//     const project =  await ProjectModel.create({
//         name: name,
//         users:[userId]
//     })
//     return project

// }

export const getAllProjects = async (userId) => {
    if(!userId){
        throw new Error("userId is required")
    }

    const projects = await projectModel.find({users:userId})
    return projects;
}
export const addUsersToProject=async({projectId,users,userId})=>{

    if(!projectId){
        throw new Error("Project Id is required")
    }
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid projectId")
    }

    if(!users){
        throw new Error("Users are required")
    }
    if (!Array.isArray(users) || users.some(userId => !mongoose.Types.ObjectId.isValid(userId))) {
        throw new Error("Invalid userId(s) in users array")
    }
    
    if (!userId) {
        throw new Error("userId is required")
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid userId")
    }

    // check whether the logged in user exist in project or not
    const project = await projectModel.find({
        _Id : projectId,
        users : userId
    })
    if(!project){
        throw new Error("you are not in this project")
    }

    // update project
    const updatedProject = projectModel.findOneAndUpdate(
        { _id : projectId},
        {$addToSet:{
            users:{ $each:users }
        }},
        { new : true })

        return updatedProject
}
// mongoose.Types.Object.Id.isValid(projectId)
// Array.isArray(users) ||  users.some( userId => mongoose.Types.ObjectId.isValid(userId))

export const getProject = async ({projectId})=> {
    if(!projectId){
        throw new Error("Please enter project Id")
    }
    if(!mongoose.Types.ObjectId.isValid(projectId)){
        throw new Error("Invalid ProjectId")
    }

    const project = await projectModel.findOne({_id : projectId}).populate('users')
    return project
}