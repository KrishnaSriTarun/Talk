const User = require("../models/user");
const passport = require("passport");

module.exports.renderLogin = (req, res) => {
      res.render("user/login");
}
module.exports.renderSignup = (req, res) => {
      res.render("user/signup");
}
module.exports.signup = async (req, res) => {
      const { username, password, email } = req.body;
      const profilePicture = req.files?.profile ? req.files.profile[0].path : null;
      const newUser = new User({ username, email, profile: profilePicture });
      let user = await User.register(newUser, password);
      passport.authenticate("local")(req, res, () => {
            req.flash("success", "Welcome to WanderLust");
            res.redirect("/talk");
      });
};
module.exports.login = async (req, res) => {
      req.flash('success', 'Welcome back to WanderLust');
      const redirectUrl = res.locals.redirectUrl || '/talk';
      res.redirect(redirectUrl);
};
module.exports.logout = (req, res, next) => {
      req.logout((err) => {
            if (err) {
                  return next(err);
            }
            req.flash("success", "You have successfully logged out");
            res.redirect("/talk");
      });
};
module.exports.showUsers = async (req, res) => {
      const { id } = req.params;
      const data = await User.findById(id);
      const isFollowing = data.followers.includes(req.user._id);
      res.render("main/showUser", { data: { ...data.toObject(), isFollowing } });
};

module.exports.followUser = async (req, res) => {
      const { id } = req.params;
      const user = await User.findById(id);
      user.followers.push(req.user._id);
      req.user.following.push(id);
      await req.user.save();
      await user.save();
      req.flash("success", "Successfully followed " + user.username);
      res.redirect(`/user/${id}`);
}
module.exports.unFollowUser = async (req, res) => {
      const { id } = req.params;
      const user = await User.findById(id);
      const index = user.followers.indexOf(req.user._id);
      if (index !== -1) {
            user.followers.splice(index, 1);
      }
      const followingIndex = req.user.following.indexOf(id);
      if (followingIndex !== -1) {
            req.user.following.splice(followingIndex, 1);
      }
      await req.user.save();
      await user.save();
      req.flash("success", "Successfully unfollowed " + user.username);
      res.redirect(`/user/${id}`);
}
module.exports.allFollowers = async (req, res) => {
      const { id } = req.params;
      const user = await User.findById(id).populate("followers");
      res.render("main/followers", { followers: user.followers });
};
