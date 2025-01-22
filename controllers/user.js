module.exports.renderLogin=(req, res) => {
      res.render("user/login");
}

module.exports.renderSignup=(req, res) => {
      res.render("user/signup");
}

module.exports.signup=async (req, res) => {
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
}
module.exports.login = async (req, res) => {
      // req.flash('success', 'Welcome back to WanderLust');
      const redirectUrl = res.locals.redirectUrl || '/talk';
      res.redirect(redirectUrl);
};


module.exports.logout = (req, res, next) => {
      req.logout((err) => {
            if (err) {
                  return next(err);
            }
            res.redirect("/talk");
      });
};