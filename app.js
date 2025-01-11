if (process.env.NODE_ENV !== "production") {
      require("dotenv").config();
}

const express = require("express");
const app = express();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const path = require("path");
const User = require("./models/user");
const PORT = 8080;
const dotenv = require("dotenv");
const Post = require("./models/data");
const multer = require('multer')
const upload = require('./cloudConfig')
const ejsMate = require("ejs-mate");

// Database connection
const dbUrl = process.env.ATLASDB_URL;
mongoose
      .connect(dbUrl)
      .then(() => console.log("Connected to DB"))
      .catch((err) => console.error("Database connection error:", err));

// Middleware setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs", ejsMate);

// Session store configuration
const store = MongoStore.create({
      mongoUrl: dbUrl,
      crypto: { secret: "secretKey" },
      touchAfter: 24 * 60 * 60,
});
store.on("error", (err) => console.error("Session Store Error:", err));

// Session options
const sessionOptions = {
      store,
      secret: process.env.SECRET || "secretKey",
      resave: false,
      saveUninitialized: false,
      cookie: {
            httpOnly: true,
            expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
            maxAge: 1000 * 60 * 60 * 24 * 7,
      },
};
app.use(session(sessionOptions));

// Passport.js setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
      res.locals.currUser = req.user || null;
      next();
});
// isLoggedIn Middleware
function isLoggedIn(req, res, next) {
      if (req.isAuthenticated && req.isAuthenticated()) {
          // User is logged in
            return next();
      }
      // User is not logged in, redirect to login page
      res.redirect('/login');
}
// Routes
app.get("/", (req, res) => {
      res.redirect("/talk");
});

app.get("/signup", (req, res) => {
      res.render("user/signup");
});

app.post("/signup", async (req, res) => {
      try {
            const { username, password, email } = req.body;
            const newUser = new User({ username, email });
            await User.register(newUser, password);
            passport.authenticate("local")(req, res, () => {
            res.redirect("/talk");
            });
      } catch (err) {
            console.log(err);
            res.redirect("/signup");
      }
});

app.get("/login", (req, res) => {
      res.render("user/login");
});

app.post(
      "/login",
      passport.authenticate("local", {
            successRedirect: "/talk",
            failureRedirect: "/login",
      })
);

app.get("/logout",isLoggedIn, (req, res, next) => {
      req.logout((err) => {
            if (err) {
                  return next(err);
            }
            res.redirect("/talk");
      });
});
app.get("/talk", async(req, res) => {
      let datas =await Post.find({});
      res.render("main/index",{datas});
})
app.get("/talk/new",isLoggedIn, (req, res) => {
      res.render("main/new");
});
app.get("/talk/search",isLoggedIn, (req, res) => {
      res.render("main/search");
});
app.get("/talk/user",isLoggedIn, (req, res) => {
      res.render("main/user");
});
app.post('/talk/uploads', upload, async (req, res) => {
      try {
            const { description } = req.body;
            const image = req.files.image ? req.files.image[0].path : null;
            const video = req.files.video ? req.files.video[0].path : null;
            if (!image && !video) {
                  return res.status(400).json({ error: 'Please upload either an image or a video.' });
            }
            const newData = new Post({ image, video, description });
            newData.owner = req.user._id;
            await newData.save();
            res.redirect('/talk');
      } catch (err) {
            console.error("Error:", err);
            res.status(500).json({ error: 'Something went wrong.' });
      }
});

// Error handler middleware (optional)
app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).send("Something went wrong!");
});


app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
});
