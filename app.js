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
const ejsMate = require("ejs-mate");

// router
const user=require('./routes/user')
const talk=require('./routes/talk')
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
// middleware
app.use('/',user)
app.use('/talk',talk)
app.get("/", (req, res) => {
      res.redirect("/talk");
});
// Error handler middleware (optional)
app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).send("Something went wrong!");
});
app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
});
