const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // Replace "*" with your frontend's URL for better security
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

const emailToSocketMapping = new Map();

io.on("connection", (socket) => {
  console.log("New Connection");

  socket.on("join-room", (data) => {
    const { roomID, emailID } = data;
    if (!roomID || !emailID) {
      console.log("Invalid data received");
      return;
    }

    console.log(`User ${emailID} joined Room ${roomID}`);
    emailToSocketMapping.set(emailID, socket.id);
    socket.join(roomID);
    socket.broadcast.to(roomID).emit("user-joined", { emailID });
  });
});

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log(`HTTP server running on PORT ${PORT}`);
});

const SOCKET_PORT = process.env.SOCKET_PORT || 8001;

io.listen(SOCKET_PORT, () => {
  console.log(`Socket.io server running on PORT ${SOCKET_PORT}`);
});
