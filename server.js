// const { method } = require('bluebird');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const A = require("./app");
const config =require("./app/config");
const MongoDB = require("./app/utils/mongodb.util");
const app = express();
const server = http.createServer(app);
const io = new Server(server,{
    cors: {
         origin: "*",
         methods: ["GET","POST"]
    }
});
// Socket IO

io.on('connection', function (socket) {
  console.log(`User ${socket.id} is connected.`);
  socket.on('save-message', (data) => {
    console.log("new")
    io.emit('new-message', { message: data });
  });
  socket.on('add-room', (data) => {
    console.log("new")
    io.emit('new-room', { message: data });
  });
  socket.on('edit-room', (data) => {
    console.log("new")
    io.emit('new-name', { message: data });
  });
  socket.on('delete-room', (data) => {
    console.log("delete")
    io.emit('Delete-Room', { message: data });
  });
  socket.on('delete-message', (data) => {
    console.log("delete")
    io.emit('delete-chat', { message: data });
  });
  socket.on('disconnect', () => {
    console.log(`User ${socket.id} is disconnected `);
  });
});
server.listen(4000,()=>{
  console.log("listening on 4000");
});


async function startServer(){
    try{
        await MongoDB.connect(config.db.uri);
        console.log("Connected to the database!");
        const PORT = config.app.port;
        A.listen(PORT, ()=>{
            console.log(`Server is running on port ${PORT}`);
        });
    }catch (error){
        console.log("Cannot connect to the database!", error);
        process.exit();
    }
}

startServer();