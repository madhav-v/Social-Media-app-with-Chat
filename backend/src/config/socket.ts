import { Server } from "socket.io";
import { createServer } from "http";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("New connection:", socket.id);

  socket.on("sendMessage", (data) => {
    socket.broadcast.emit("messageReceived", data);
  });
});

export { httpServer, io };
