const express = require("express");
const User = require("../config"); // Import User model
const router = express.Router();

// Serve Login Page
router.get("/", (req, res) => {
    res.render("login", { error: null });
});

// Serve Register Page
router.get("/register", (req, res) => {
    res.render("register", { error: null });
});

// Register New User (Signup)
router.post("/register", async (req, res) => {
    try {
        const { name, phone, mail, aadhar, password, confirmPassword } = req.body;

        if (!name || !phone || !mail || !aadhar || !password || !confirmPassword) {
            return res.status(400).render("register", { error: "All fields are required!" });
        }

        if (password !== confirmPassword) {
            return res.status(400).render("register", { error: "Passwords do not match!" });
        }

        const existingUser = await User.findOne({ phone });
        if (existingUser) {
            return res.status(400).render("register", { error: "Phone number already registered!" });
        }

        // Store Password as Plain Text (Not Secure)
        const newUser = new User({ name, phone, mail, aadhar, password });
        await newUser.save();

        console.log("User registered:", newUser);
        res.redirect("/");
    } catch (error) {
        console.error("Error in registration:", error);
        res.status(500).render("register", { error: "Internal Server Error" });
    }
});

// User Login
router.post("/login", async (req, res) => {
    try {
        const { phone, password } = req.body;

        if (!phone || !password) {
            return res.status(400).render("login", { error: "Phone and password are required!" });
        }

        // Find user in DB
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(400).render("login", { error: "User not found!" });
        }

        // Compare Plain Text Passwords (Not Secure)
        if (password !== user.password) {
            return res.status(400).render("login", { error: "Invalid password!" });
        }

        console.log("User logged in:", phone);
        res.render("dashboard", { user });
    } catch (error) {
        console.error("❌ Error in login:", error);
        res.status(500).render("login", { error: "Internal Server Error" });
    }
});

module.exports = router;
