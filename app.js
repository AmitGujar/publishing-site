const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const methodOverride = require("method-override");
const articleRouter = require("./src/routes/articles");

const Article = require("./src/models/article");
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const User = require("./src/models/user");
const jwt = require("jsonwebtoken");
//db
const connectDB = require("./src/configs/db");
connectDB();
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
const initializePassport = require("./passport-config");
const { default: mongoose } = require("mongoose");

initializePassport(
  passport,
  (email) => User.find((user) => user.email === email),
  (id) => User.find((user) => user.id === id)
);

app.use("/articles", articleRouter);

app.get("/", checkedAuthentication, async (req, res) => {
  const articles = await Article.find().sort({
    createdAt: "desc",
  });
  res.render("index", { articles: articles });
});

app.get("/login", checkedNotAuthentication, async (req, res) => {
  res.render("login");
});

app.get("/register", checkedNotAuthentication, async (req, res) => {
  res.render("register");
});

app.delete("/logout", (req, res) => {
  req.logOut();
  req.redirect("/login");
});

app.post("/register", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "User exists",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              name: req.body.name,
              email: req.body.email,
              password: hash,
            });
            user
              .save()
              .then((result) => {
                console.log(result);
                res.render("login");
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({
                  error: err,
                });
              });
          }
        });
      }
    });
});

app.post("/login", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth Failed",
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth Failed",
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0],
              userId: user[0].id,
            },
            process.env.JWT_KEY,
            {
              expiresIn: "1h",
            }
          );
          return res.render("index");
        }
        res.status(401).json({
          message: "Auth Failed",
        });
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

function checkedAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

function checkedNotAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

module.exports = app;
