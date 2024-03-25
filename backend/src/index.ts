import express from "express";
import { createConnection } from "typeorm";
import { User } from "./models/User.model";

const app = express();
app.use(express.json());

const PORT = 3005;

createConnection({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "madhav2058",
  database: "socialMedia",
  entities: [User],
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
