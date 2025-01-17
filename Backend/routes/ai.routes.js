import { Router } from "express";
import * as aiController from '../controllers/ai.controller.js'
const router = Router()

router.get('/get-result',aiController.getResultController)

export default router