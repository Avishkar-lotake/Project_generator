import ProjectModel from '../models/project.model.js'
import userModel from '../models/user.model.js'
import * as projectService from '../services/project.service.js'
import {validationResult} from 'express-validator'


export const createProject = async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const { name } = req.body;
        const loggedInUser = await userModel.findOne({ email: req.user.email });
        const userId = loggedInUser._id;

        const newProject = await projectService.createProject({ name, userId });

        res.status(201).json(newProject);

    } catch (err) {
        console.log(err);
        res.status(400).send(err.message);
    }



}
// export const createProjectController = async(req,res)=>{
//     const errors = validationResult(req)

//     if(!errors.isEmpty()){
//         return res.status(400).json(
//             {
//                 error:errors.array()
//             }
//         )
//     }
//     try{
//         const {name} = req.body;
//         const loggedInUser = await ProjectModel.findOne({email:req.user.email})
//         console.log(loggedInUser)
//         const userId = loggedInUser._id
//         const newProject = projectService.createProject({name , userId} )
    
//         res.status(201).json({newProject})
//     }
//     catch(err){
//         console.log(err)
//         res.status(400).send(err.message)
//     }
// }
export const getAllProjects = async (req, res) => {

    try {
        const loggedInUser = await userModel.findOne({ email: req.user.email });
        const userId = loggedInUser._id;

        const allUserProjects = await projectService.getAllProjects(userId);

        res.status(200).json({  projects: allUserProjects});

    }
    catch (err) {
        console.log(err);
        res.status(400).send(err.message);
    }
}

export const addUserToProject = async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    try{
    const { projectId , users} = req.body
    const loggedInUser = await userModel.findOne({email:req.user.email})
    const userId = loggedInUser._id

    const project  = await projectService.addUsersToProject({projectId,users,userId})

    return res.status(200).json({project})
    }

    catch(err){
        console.log(err)
        res.status(401).json({error:err.message})
    }
}

export const getProjectById = async (req,res)=>{
    const {projectId} = req.params
    try{
        const project = await projectService.getProject({projectId})
        res.status(201).json({project})
    }
    catch(err){
        console.log(err)
        req.status(400).json({error : message.err})
    }

}
