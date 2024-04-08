const express = require("express");
const app = express();
const http = require('http'); //for connect socket io with my server
const cors = require('cors');
const { Server } = require('socket.io');

app.use(cors());

//For make connection with node js and socket io with createserver method
//This is like node js server
const server = http.createServer(app);

//This socket io server connection 
const io = new Server(server, {
    cors: {
        //which origin we want to allow our fronend 
        origin: "http://localhost:3000",
        //which method it will support
        methods: ["GET","POST"]
    },
    connectionStateRecovery: {}
});

//when connection is made to the call on method to get which user is connected.
io.on("connection", (socket) => {
    console.log(`User connected : ${socket.id}`);

    //When user is disconnected
    socket.on("disconnect", () => {
        console.log("User is Disconnected");
    })

    //listen  frontend emited event
    socket.on("send-message", (msg) => {
        console.log(msg);

        //Brodcats the recived message to all the connected users
        io.emit("recived-message", msg);
        // if you want to send a message to everyone except for a certain emitting socket, we have the broadcast flag for emitting from that socket:
        // socket.broadcast.emit("hi");
    });


})


// io.on("connection", (socket) => {
//   // join the room named 'some room'
//   socket.join("some room");

//   // broadcast to all connected clients in the room
//   io.to("some room").emit("hello", "world");

//   // broadcast to all connected clients except those in the room
//   io.except("some room").emit("hello", "world");

//   // leave the room
//   socket.leave("some room");
// });

// users[data.to].emit("receivedMessage", data);




//listen or start our server.
server.listen(5000, () => console.log("Server is running on port - 5000"));
