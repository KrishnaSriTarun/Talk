const User = require("../models/user");
const passport = require("passport");

module.exports.renderLogin=(req, res) => {
      res.render("user/login");
}
module.exports.renderSignup=(req, res) => {
      res.render("user/signup");
}
module.exports.signup=async (req, res) => {
            const { username, password, email } = req.body;
            const newUser = new User({ username, email });
            await User.register(newUser, password);
            passport.authenticate("local")(req, res, () => {
            req.flash("success", "Welcome to WanderLust");
            res.redirect("/talk"); 
            });
}
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
      // console.log(data);
      res.render("main/showUser", { data });
}