const express = require('express');
const router = express.Router();
const userRouter=require("../controllers/user")
const passport = require('passport');
const wrapAsync = require("../utils/wrapAsync");
const {saveRedirectUrl}=require("../middleware")

router.get('/signup',userRouter.renderSignup);

router.post('/signup',wrapAsync(userRouter.signup));

router.get('/login',userRouter.renderLogin);

router.post('/login',saveRedirectUrl, passport.authenticate("local", {
      successRedirect: "/talk",
      failureRedirect: "/login",failureFlash:true
}),userRouter.login);

router.get('/logout',userRouter.logout);

module.exports = router;