import express from "express";
import { createConnection } from "typeorm";
import { User } from "./models/User.model";
import routes from "./routes";
// import { Profile } from "./models/Profile.Model";
import { Post } from "./models/Post.model";
import cors from "cors";
import { FriendRequest } from "./models/FriendRequest.model";
import { Chat } from "./models/Chat.model";
import { Message } from "./models/Message.model";
import { httpServer } from "./config/socket";

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

createConnection({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "madhav2058",
  database: "Social",
  entities: [User, Post, FriendRequest, Chat, Message],
  synchronize: true,
  // logging: true,
})
  .then(() => {
    console.log("Database connected");
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error connecting database", err);
  });
