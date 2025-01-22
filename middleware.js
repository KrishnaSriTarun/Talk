module.exports.isLoggedIn=(req, res, next)=> {
      if (req.isAuthenticated && req.isAuthenticated()) {
            return next();
      }
      res.redirect('/login');
}