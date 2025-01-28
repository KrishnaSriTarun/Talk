const express = require('express');
const router = express.Router();
const userRouter=require("../controllers/user")
const passport = require('passport');
const wrapAsync = require("../utils/wrapAsync");
const {saveRedirectUrl,ensureAuthenticated,isLoggedIn}=require("../middleware");
const upload = require('../cloudConfig');

router.get('/signup',userRouter.renderSignup);

router.post('/signup',upload,wrapAsync(userRouter.signup));

router.get('/login',userRouter.renderLogin);

router.post('/login',saveRedirectUrl, passport.authenticate("local", {
      successRedirect: "/talk",
      failureRedirect: "/login",failureFlash:true
}),userRouter.login);

router.get('/logout',userRouter.logout);
router.get('/user/:id',ensureAuthenticated,wrapAsync(userRouter.showUsers));
router.post('/user/follow/:id',ensureAuthenticated, wrapAsync(userRouter.followUser));
router.post('/user/unfollow/:id',ensureAuthenticated, wrapAsync(userRouter.unFollowUser));

router.get('/user/followers/:id',ensureAuthenticated, wrapAsync(userRouter.allFollowers));
module.exports = router;