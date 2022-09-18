const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const methodOverride = require("method-override");
const articleRouter = require("./src/routes/articles"); 
const Article = require("./src/models/article");
//db
const connectDB = require("./src/configs/db");
connectDB();
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
app.use(methodOverride('_method'))


app.use('/articles',articleRouter)




app.get("/", async (req, res) => {
  const articles = await Article.find().sort({
    createdAt: 'desc'
  })
  res.render("index", {articles: articles});
});

module.exports = app;
