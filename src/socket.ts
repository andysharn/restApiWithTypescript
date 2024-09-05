import {Server as SocketIOServer,Socket } from 'socket.io';
import { Server as HTTPServer} from 'http';

export let io:SocketIOServer;
export const initSocket=(server:HTTPServer)=>{
    io=new SocketIOServer(server,{
        cors:{
            origin:'*',
            methods:['GET','POST'],
        },
    });

io.on('connection',(socket:Socket)=>{
    console.log('A user connected',socket.id);
    socket.on('joinRoom',(room:string)=>{
        socket.join(room);
        console.log(`${socket.id} joined room ${room}`);
    });
    socket.on('leaveRoom',(room:string)=>{
        socket.leave(room);
        console.log(`${socket.id} left the room ${room}`);

    })
    socket.on('message',(data:{room:string;message:string})=>{
        io.to(data.room).emit('message',data.message);
        console.log(`message from ${socket.id} to room ${data.room }:${data.message} `);
    })
    socket.on('disconnected',()=>{
        console.log('a user disconnected')
    });
});
}

export const  getIoInstance =():SocketIOServer=>{
    if(!io){
        throw new Error('socket.io is not initialized')
    }
    return io 
};

// io.emit('update',{message :'resource updated '});