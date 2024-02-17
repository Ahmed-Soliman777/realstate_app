import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";

const app = express();
const port = 3000;

app.use(express.json());

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

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

// middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error.";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
