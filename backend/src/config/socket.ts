import { Server } from "socket.io";
import { createServer, Server as HTTPServer } from "http";

const httpServer: HTTPServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("New connection:", socket.id);

  socket.on("like", (data) => {
    // Broadcast the 'like' event to all clients except the sender
    socket.broadcast.emit("like", data);
  });

  // Example: Listen for a 'comment' event from the client
  socket.on("comment", (data) => {
    // Broadcast the 'comment' event to all clients except the sender
    socket.broadcast.emit("comment", data);
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("Disconnected");
  });
});

export default httpServer;
