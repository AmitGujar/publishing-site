const express = require("express");
const app = express();
const dotenv = require('dotenv').config()

//db
const connectDB = require('./src/configs/db');

connectDB();
app.set("view engine", "ejs");


app.use(express.json());
app.use(express.urlencoded({extended: false}))

module.exports = app;