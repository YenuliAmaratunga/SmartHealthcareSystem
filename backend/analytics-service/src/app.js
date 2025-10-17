import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import analyticsRoutes from "./routes/analyticsRoutes.js";

dotenv.config();

const app = express();

//Middleware
app.use(cors());
app.use(express.json());

//Connect to MongoDB
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Could not connect to MongoDB...", err));
}

app.get("/", (req, res) => {
  res.json({ message: "Analytics Service is running" });
});

// Mount under a clean base path
app.use("/api/analytics", analyticsRoutes);

export default app;