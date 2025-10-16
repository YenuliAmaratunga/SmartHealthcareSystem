import app from "./index.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;

// connect to MongoDB first
connectDB();

// then start the server
app.listen(PORT, () => {
  console.log(`🚀 Patient Service running on port ${PORT}`);
});
