// Import dependencies
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables from .env file
dotenv.config();

// Initialize app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // parse JSON request bodies

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("✅ Connected to MongoDB"))
.catch((err) => {
  console.error("❌ Failed to connect to MongoDB:", err.message);
  process.exit(1); // Stop the app if DB connection fails
});

// Test route
app.get('/', (req, res) => {
  res.send('Payment API is running ✅');
});

// Server listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

