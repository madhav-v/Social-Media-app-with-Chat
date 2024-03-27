import express from "express";
import { createConnection } from "typeorm";
import { User } from "./models/User.model";
import routes from "./routes";
import { Profile } from "./models/Profile.Model";
import { Post } from "./models/Post.model";
import cors from "cors";
import { FriendRequest } from "./models/FriendRequest.model";

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

app.use("/api/v1", routes);

const PORT = 3005;

createConnection({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "madhav2058",
  database: "socialMedia",
  entities: [User, Profile, Post, FriendRequest],
  synchronize: true,
  // logging: true,
})
  .then(() => {
    console.log("Database connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error connecting database", err);
  });
