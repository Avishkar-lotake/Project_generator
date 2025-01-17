import {Router} from 'express'
const router = Router()
import * as authMiddleware from '../middleware/auth.middleware.js'
import * as ProjectController from '../controllers/project.controller.js'
import { body } from 'express-validator'

router.post('/create',authMiddleware.authUser,
    body('name').isString().withMessage("name is required"),
    ProjectController.createProject)

router.get('/all',authMiddleware.authUser,ProjectController.getAllProjects)

router.put('/add-user',authMiddleware.authUser,
    body('projectId').isString().withMessage("Project Id is required"),
    body('users').isArray({min:1}).withMessage("users must be a array of strings").bail()
    .custom((users) => users.every(user => typeof user == 'string')).withMessage('Each user must be a String')
    ,ProjectController.addUserToProject)
export default router;

router.get('/get-project/:projectId',authMiddleware.authUser,
    ProjectController.getProjectById)