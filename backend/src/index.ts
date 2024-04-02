import express from "express";
import { createConnection } from "typeorm";
import { User } from "./models/User.model";
import routes from "./routes";
import { Post } from "./models/Post.model";
import cors from "cors";
import { FriendRequest } from "./models/FriendRequest.model";
import { Chat } from "./models/Chat.model";
import { Message } from "./models/Message.model";
import { Comment } from "./models/Comment.model";
import http from "http";
import { Server, Socket } from "socket.io";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use("/public", express.static("public"));
app.use("/api/v1", routes);

const PORT = 3005;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket: Socket) => {
  console.log("A user connected");

  socket.on("like", (data) => {
    socket.broadcast.emit("like", data);
  });

  socket.on("comment", (data) => {
    console.log(data);

    socket.broadcast.emit("comment", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

createConnection({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "madhav2058",
  database: "Social",
  entities: [User, Post, FriendRequest, Chat, Message, Comment],
  synchronize: true,
  // logging: true,
})
  .then(() => {
    console.log("Database connected");

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error connecting database", err);
  });
