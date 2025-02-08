const express = require("express");
const authRoutes = require("./routes/authRoutes"); // Import routes

// Initialize Express App
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set View Engine
app.set("view engine", "ejs");

// Serve Static Files
app.use(express.static("public"));

// Use Routes
app.use("/", authRoutes);

module.exports = app;
