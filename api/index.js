import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";

const app = express();
const port = 3000;

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log(new Date(), `MongoDB connected`);
  })
  .catch((error) => {
    console.log(error);
  });

app.listen(port, () => {
  console.log("Listening on port " + port);
});

app.use("/api/user", userRouter)
