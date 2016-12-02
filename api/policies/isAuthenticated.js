module.exports = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.session.returnTo = req.url;
    return res.redirect('/login');
  }
};
