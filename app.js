const express = require("express");
const session = require("express-session");
const path = require("path");
require("dotenv").config();

const app = express();
const authRoutes = require("./routes/auth");
const { connectToMongo } = require('./database');
const PORT = 2203;

connectToMongo();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    // store: new pgSession({ pool }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 60 * 1000, // 30 mins
      httpOnly: true,
      secure: false, // Set to true if using HTTPS
    },
  })
);

app.use(express.static("public"));
app.set("view engine", "ejs");

// Serve the main page
app.get("/", (req, res) => {
  res.render("index");
});

app.use("/", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
