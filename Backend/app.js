import express from 'express'
import morgan from 'morgan'
import userRoutes from './routes/user.routes.js'
import projectRoutes from './routes/project.routes.js'
import aiRoutes from './routes/ai.routes.js'
import connect from './db/db.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'


connect()
const app = express()

// import projectRoutes from './routes/project.routes.js'
// cors policy of backend by default restricts everyone to access backend routes
// thats why we use this cors package so that our frontend can access backend
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(morgan('dev'))
app.use(cookieParser())
app.use('/projects',projectRoutes)
app.use('/users',userRoutes)
app.use('/ai',aiRoutes)
export default app