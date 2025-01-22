const express = require('express');
const router = express.Router();
const userRouter=require("../controllers/user")
const passport = require('passport');

router.get('/signup',userRouter.renderSignup);

router.post('/signup',userRouter.signup);

router.get('/login',userRouter.renderLogin);

router.post('/login', passport.authenticate("local", {
      successRedirect: "/talk",
      failureRedirect: "/login"
}));

router.get('/logout',userRouter.logout);

module.exports = router;