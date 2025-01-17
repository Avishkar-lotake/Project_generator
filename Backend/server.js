import 'dotenv/config.js'
import http from 'http'
import app from './app.js'
import {Server} from 'socket.io'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import ProjectModel from './models/project.model.js'
import { generateResult } from './services/ai.service.js'


const port = process.env.PORT || 3000
const server = http.createServer(app)
const io = new Server(server , {
    cors :{
        origin :'*'
    }
});


io.use(async (socket , next) => {
    try{
        const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(' ')[1]
        const projectId = socket.handshake.query.projectId

        if(!mongoose.Types.ObjectId.isValid(projectId)){
            return next( new Error("Invalid ProjectId"))
        }
        if(!token){
            return next(new Error('Authorization error'))
        }
        socket.project = await ProjectModel.findById(projectId)
        
        const decoded = jwt.verify( token , process.env.JWT_SECRET)

        if(!decoded){
                next( new Error("Authorization Error"))
        }

        socket.user = decoded
        next();
    }
    
    catch(err){
        next(err)
    }
}
)

io.on('connection', socket => {
    socket.roomId = socket.project._id.toString();
    console.log('a user connected')
    socket.join(socket.roomId) 

    socket.on('project-message', async data =>{
    const message = data.message;
    const aiIsPresentInMessage = message.includes('@ai')
    socket.broadcast.to(socket.roomId).emit('project-message',data)

    if(aiIsPresentInMessage){
        const prompt = message.replace('@ai','')
        const result = await generateResult(prompt)
        io.to(socket.roomId).emit('project-message',{
            sender :{
                _id : 'ai',
                email : "@ai"
            },
            message:result
        })
        return
    }      
        //io.to(socket.roomId) will send message to both sender and receiver thats why
        //we used socket.broadcast.to()
    })
    socket.on('disconnect', () => {
        console.log('user Disconnected')
        socket.leave(socket.roomId)
    });
});

server.listen(port , ()=>{
    console.log(`server is running on port ${port}`)
})