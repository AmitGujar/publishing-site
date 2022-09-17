const express = require("express");
const app = express();
const dotenv = require("dotenv").config();

//db
const connectDB = require("./src/configs/db");
connectDB();

app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("login");
});

module.exports = app;
