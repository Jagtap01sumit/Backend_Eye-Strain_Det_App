require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./model/UserModel");
const Profile = require("./model/ProfileModel");
const bcrypt = require("bcrypt");
const connectDB = require("./Db/dbConfig");

const app = express();
const PORT = 8000;

app.use(express.json());
app.use(cors());

connectDB();
app.get("/getData", async (req, res) => {
  try {
    const { email } = req.query;
    console.log(email);
    if (!email) {
      return res.status(400).json({ error: "Email parameter is missing" });
    }

    const user = await Profile.findOne({
      email: email,
    });

    if (user !== null) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/addData", async (req, res) => {
  try {
    const { username, email, birthdate, phone, age, gender, address } =
      req.body;
    console.log(req.body, "req");
    const isUserExists = await Profile.findOne({
      email: email,
    });
    console.log(email);

    if (isUserExists) {
      console.log("existes");
      return res.status(400).json({
        error:
          "You can edit profile only once!!! (todo: create a update info form)",
      });
    } else {
      const newUser = new Profile({
        username,
        email,
        birthdate,
        phone,
        age,
        gender,
        address,
      });

      const savedUser = await newUser.save();
      console.log("Profile created successfully:", savedUser.email);
      res.status(201).json(savedUser);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    const isUserExists = await User.findOne({ email: email });

    if (isUserExists) {
      return res.status(400).json({ error: "user already exists" });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        email,
        password: hashedPassword,
      });
      const savedUser = await newUser.save();
      console.log("User created successfully:", savedUser.email);
      res.status(201).json(savedUser);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    const user = await User.findOne({ email: email });
    console.log(user.email, user.password);
    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        res.status(200).json({ message: "User verified" });
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
