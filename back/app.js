// MONGODB LINK: mongodb+srv://Natsumi37:<password>@openclassrooms-p6.pbbosrl.mongodb.net/?retryWrites=true&w=majority
// MONGODB PASS: CbdkdYR8j9oVc0Pz

const express = require("express");
const mongoose = require("mongoose");

const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");
const path = require("path");

const app = express();

mongoose.connect("mongodb+srv://Natsumi37:CbdkdYR8j9oVc0Pz@openclassrooms-p6.pbbosrl.mongodb.net/?retryWrites=true&w=majority")
  .then(() => {
    console.log("Successfully connected to MongoDB Atlas!");
  })
  .catch((error) => {
    console.log("Unable to connect to MongoDB Atlas!");
    console.error(error);
  });

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;

